import { createBrowserRouter, Outlet } from 'react-router';
import { MobileFrame } from './components/MobileFrame';
import LoginPage from './pages/LoginPage';
import PersonalityPage from './pages/PersonalityPage';
import InterestsPage from './pages/InterestsPage';
import StartingPointPage from './pages/StartingPointPage';
import PlannerPage from './pages/PlannerPage';
import ItineraryPage from './pages/ItineraryPage';
import LiveModePage from './pages/LiveModePage';

function Root() {
  return (
    <MobileFrame>
      <Outlet />
    </MobileFrame>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: LoginPage },
      { path: 'onboarding/personality', Component: PersonalityPage },
      { path: 'onboarding/interests', Component: InterestsPage },
      { path: 'onboarding/starting-point', Component: StartingPointPage },
      { path: 'planner', Component: PlannerPage },
      { path: 'itinerary', Component: ItineraryPage },
      { path: 'live', Component: LiveModePage },
    ],
  },
]);
