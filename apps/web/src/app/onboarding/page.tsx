// Rendered content lives in OnboardingFlow (mounted once by the layout),
// which reads the active step from the URL. This page exists only so
// /onboarding is a real route for the URL bar, browser back/forward, and
// proxy.ts route protection.
export default function OnboardingPage() {
  return null;
}
