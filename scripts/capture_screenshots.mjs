import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();

  // 1. Landing Page
  console.log("1. Navigating to Landing Page...");
  await page.goto("http://localhost:8443", { waitUntil: "networkidle", timeout: 25000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "report/screenshots/01_landing_page.png" });

  // 2. Login Page
  console.log("2. Navigating to Login Page...");
  await page.goto("http://localhost:8443/login", { waitUntil: "networkidle", timeout: 25000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: "report/screenshots/02_login_page.png" });

  // Perform Login
  console.log("Logging in as Alex Rivera (alex.student@university.edu)...");
  await page.fill('input[type="email"]', "alex.student@university.edu");
  await page.fill('input[type="password"]', "Password123!");
  await page.click('button[type="submit"]');

  // Wait for dashboard navigation
  await page.waitForURL("**/dashboard", { timeout: 25000 });
  await page.waitForTimeout(3500);
  console.log("Navigated to Dashboard! URL:", page.url());

  // 3. Dashboard
  await page.screenshot({ path: "report/screenshots/03_dashboard.png" });

  // 4. Resume Analyzer
  console.log("Navigating to Resume Analyzer...");
  await page.goto("http://localhost:8443/resume", { waitUntil: "networkidle", timeout: 25000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: "report/screenshots/04_resume_analyzer.png" });

  // 5. Internships Discovery & Matching
  console.log("Navigating to Internships...");
  await page.goto("http://localhost:8443/internships", { waitUntil: "networkidle", timeout: 25000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: "report/screenshots/05_internships_discovery.png" });

  // 6. Learning Roadmap
  console.log("Navigating to Roadmap...");
  await page.goto("http://localhost:8443/roadmap", { waitUntil: "networkidle", timeout: 25000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: "report/screenshots/06_learning_roadmap.png" });

  // 7. Applications Tracker
  console.log("Navigating to Applications...");
  await page.goto("http://localhost:8443/applications", { waitUntil: "networkidle", timeout: 25000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: "report/screenshots/07_applications_tracker.png" });

  // 8. AI Mock Interviews
  console.log("Navigating to Mock Interviews...");
  await page.goto("http://localhost:8443/interviews", { waitUntil: "networkidle", timeout: 25000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: "report/screenshots/08_mock_interviews.png" });

  // 9. Portfolio Builder
  console.log("Navigating to Portfolio...");
  await page.goto("http://localhost:8443/portfolio", { waitUntil: "networkidle", timeout: 25000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: "report/screenshots/09_portfolio_builder.png" });

  // 10. Analytics
  console.log("Navigating to Analytics...");
  await page.goto("http://localhost:8443/analytics", { waitUntil: "networkidle", timeout: 25000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: "report/screenshots/10_analytics.png" });

  // 11. Profile
  console.log("Navigating to Profile...");
  await page.goto("http://localhost:8443/profile", { waitUntil: "networkidle", timeout: 25000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: "report/screenshots/11_profile.png" });

  await browser.close();
  console.log("All rich screenshots captured successfully!");
}

main().catch(console.error);
