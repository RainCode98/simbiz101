// server.ts - Next.js Standalone + Socket.IO
import { setupSocket } from '@/lib/socket';
import { createServer } from 'http';
import { Server } from 'socket.io';
import next from 'next';
import { db } from '@/lib/db';

const dev = process.env.NODE_ENV !== 'production';
const currentPort = 3000;
const hostname = '0.0.0.0';

// Custom server with Socket.IO integration
async function createCustomServer() {
  try {
    // Create Next.js app
    const nextApp = next({ 
      dev,
      dir: process.cwd(),
      // In production, use the current directory where .next is located
      conf: dev ? undefined : { distDir: './.next' }
    });

    await nextApp.prepare();
    const handle = nextApp.getRequestHandler();

    // Create HTTP server that will handle both Next.js and Socket.IO
    const server = createServer((req, res) => {
      // Skip socket.io requests from Next.js handler
      if (req.url?.startsWith('/api/socketio')) {
        return;
      }
      handle(req, res);
    });

    // Setup Socket.IO
    const io = new Server(server, {
      path: '/api/socketio',
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    setupSocket(io);

    // Start hourly salary deduction
    startSalaryDeduction();
    
    // Start sequential project payments
    startProjectPayments();

    // Start the server
    server.listen(currentPort, hostname, () => {
      console.log(`> Ready on http://${hostname}:${currentPort}`);
      console.log(`> Socket.IO server running at ws://${hostname}:${currentPort}/api/socketio`);
    });

  } catch (err) {
    console.error('Server startup error:', err);
    process.exit(1);
  }
}

// Start the server
createCustomServer();

// Hourly salary deduction function
async function startSalaryDeduction() {
  console.log('> Starting hourly salary deduction system...');
  
  // Run immediately on start, then every hour
  await deductAllSalaries();
  
  setInterval(async () => {
    await deductAllSalaries();
  }, 60 * 60 * 1000); // 1 hour in milliseconds
}

async function deductAllSalaries() {
  try {
    const companies = await db.company.findMany({
      include: {
        employees: true
      }
    });

    const results = [];

    for (const company of companies) {
      if (company.employees.length === 0) continue;

      // Calculate hourly salary deduction (monthly salary / 730 hours ≈ hourly rate)
      const totalHourlyDeduction = company.employees.reduce((total, employee) => {
        const hourlyRate = employee.salary / 730; // Approximate hours in a month
        return total + hourlyRate;
      }, 0);

      // Deduct salary from company balance (allow negative balance)
      const updatedCompany = await db.company.update({
        where: { id: company.id },
        data: {
          money: {
            decrement: totalHourlyDeduction
          },
          expenses: {
            increment: totalHourlyDeduction
          }
        }
      });

      results.push({
        companyId: company.id,
        companyName: company.name,
        deductedAmount: totalHourlyDeduction,
        newBalance: updatedCompany.money,
        employeeCount: company.employees.length
      });

      console.log(`> Salary deducted: ${company.name} - ${totalHourlyDeduction.toFixed(2)} (${company.employees.length} employees)`);
    }

    if (results.length > 0) {
      const totalDeducted = results.reduce((sum, r) => sum + r.deductedAmount, 0);
      console.log(`> Hourly salary deduction completed: ${totalDeducted.toFixed(2)} total from ${results.length} companies`);
    }
  } catch (error) {
    console.error('Mass salary deduction error:', error);
  }
}

// Sequential project payment system
async function startProjectPayments() {
  console.log('> Starting sequential project payment system...');
  
  // Run immediately on start, then every minute
  await processProjectPayments();
  
  setInterval(async () => {
    await processProjectPayments();
  }, 60 * 1000); // 1 minute in milliseconds
}

async function processProjectPayments() {
  try {
    // Get all active projects (including those with 0 progress in database)
    const activeProjects = await db.project.findMany({
      where: {
        status: 'in_progress'
      },
      include: {
        company: true
      }
    });

    console.log(`> Processing payments for ${activeProjects.length} active projects`);

    const results = [];
    const now = new Date();

    for (const project of activeProjects) {
      // Calculate real-time progress like the active projects API
      let progress = 0;
      if (project.startTime && project.endTime) {
        const startTime = new Date(project.startTime);
        const endTime = new Date(project.endTime);
        const totalTime = endTime.getTime() - startTime.getTime();
        const elapsed = now.getTime() - startTime.getTime();
        progress = Math.min(100, Math.max(0, (elapsed / totalTime) * 100));
      }

      // Only process if project has started making progress
      if (progress <= 0) {
        console.log(`> Project ${project.name}: progress=${progress}%, skipping (not started)`);
        continue;
      }

      // Calculate payment amount per minute
      const totalDuration = project.endTime && project.startTime 
        ? (new Date(project.endTime).getTime() - new Date(project.startTime).getTime()) / (1000 * 60) // minutes
        : 60; // default 60 minutes if not set
      
      const paymentPerMinute = project.baseReward / totalDuration;
      const maxPayment = (project.baseReward * progress) / 100;
      
      // Check if we should make a payment
      const lastPayment = project.lastPaymentTime ? new Date(project.lastPaymentTime) : project.startTime ? new Date(project.startTime) : now;
      const minutesSinceLastPayment = (now.getTime() - lastPayment.getTime()) / (1000 * 60);
      
      console.log(`> Project ${project.name}: progress=${progress.toFixed(1)}%, amountPaid=${project.amountPaid}, maxPayment=${maxPayment.toFixed(2)}, minutesSinceLast=${minutesSinceLastPayment.toFixed(1)}`);
      
      if (minutesSinceLastPayment >= 1 && project.amountPaid < maxPayment) {
        // Calculate payment amount
        const paymentAmount = Math.min(paymentPerMinute * minutesSinceLastPayment, maxPayment - project.amountPaid);
        
        console.log(`> Project ${project.name}: paymentAmount=${paymentAmount.toFixed(2)}, paymentPerMinute=${paymentPerMinute.toFixed(2)}`);
        
        if (paymentAmount > 0.01) { // Only process if payment is significant
          // Update project and company balance
          await db.$transaction(async (tx) => {
            // Update project amount paid and progress
            await tx.project.update({
              where: { id: project.id },
              data: {
                progress: progress,
                amountPaid: {
                  increment: paymentAmount
                },
                lastPaymentTime: now
              }
            });

            // Update company balance
            await tx.company.update({
              where: { id: project.companyId },
              data: {
                money: {
                  increment: paymentAmount
                },
                revenue: {
                  increment: paymentAmount
                }
              }
            });
          });

          results.push({
            projectId: project.id,
            projectName: project.name,
            companyName: project.company.name,
            paymentAmount,
            totalPaid: project.amountPaid + paymentAmount,
            maxPayment,
            progress: progress
          });

          console.log(`> Project payment: ${project.name} - ${paymentAmount.toFixed(2)} paid to ${project.company.name}`);
        } else {
          console.log(`> Project ${project.name}: payment too small (${paymentAmount.toFixed(4)})`);
        }
      } else {
        console.log(`> Project ${project.name}: not ready for payment. minutesSinceLast=${minutesSinceLastPayment.toFixed(1)}, amountPaid=${project.amountPaid}, maxPayment=${maxPayment.toFixed(2)}`);
      }
    }

    if (results.length > 0) {
      const totalPaid = results.reduce((sum, r) => sum + r.paymentAmount, 0);
      console.log(`> Project payments completed: ${totalPaid.toFixed(2)} total from ${results.length} projects`);
    } else {
      console.log(`> No project payments processed this cycle`);
    }
  } catch (error) {
    console.error('Project payment processing error:', error);
  }
}
