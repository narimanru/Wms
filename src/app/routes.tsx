import { createBrowserRouter } from 'react-router';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Marking from './pages/Marking';
import DistributionWizard from './pages/DistributionWizard';
import ProductsInventory from './pages/ProductsInventory';
import TransferCodes from './pages/TransferCodes';
import UPDWork from './pages/UPDWork';
import AIHub from './pages/AIHub';
import ShipmentCheck from './pages/ShipmentCheck';
import UPDAnalyzer from './pages/UPDAnalyzer';
import KIZVault from './pages/KIZVault';
import SKUDetails from './pages/SKUDetails';
import ReplaceCodes from './pages/ReplaceCodes';
import AIAnalytics from './pages/AIAnalytics';
import AIAnalyticsResult from './pages/AIAnalyticsResult';
import AIPlannerDashboard from './pages/AIPlannerDashboard';
import ShipmentsPlan from './pages/ShipmentsPlan';
import ProductionPlan from './pages/ProductionPlan';
import KIZPlan from './pages/KIZPlan';
import SeasonalDashboard from './pages/SeasonalDashboard';
import SeasonalWeeklyPlan from './pages/SeasonalWeeklyPlan';
import SeasonScenarios from './pages/SeasonScenarios';
import ProductionCapacity from './pages/ProductionCapacity';
import AutopilotSetup from './pages/AutopilotSetup';
import AutopilotReview from './pages/AutopilotReview';
import AutopilotRunning from './pages/AutopilotRunning';
import AutopilotResult from './pages/AutopilotResult';
import AutopilotObjects from './pages/AutopilotObjects';
import AutopilotConstraints from './pages/AutopilotConstraints';
import PolicyExplanation from './pages/PolicyExplanation';
import ProductionOrders from './pages/ProductionOrders';
import CreateProductionOrder from './pages/CreateProductionOrder';
import ProductionOrderDetail from './pages/ProductionOrderDetail';
import ImportKIZ from './pages/ImportKIZ';
import RepricerHistory from './pages/RepricerHistory';
import './pages/production/productionHelpers'; // Import helpers to set up globals
import ProductionOrderDetailPage from './pages/production/ProductionOrderDetailPage';
import ProductionOrdersList from './pages/production/ProductionOrders';
import ProductionCalendar from './pages/production/ProductionCalendar';
import ProductionShipments from './pages/production/ProductionShipments';
import ProductionDocuments from './pages/production/ProductionDocuments';
import PortalSelector from './pages/PortalSelector';
import { UploadHistory } from './components/UploadHistory';
import Layout from './components/Layout';
import SellerPartnersDashboard from './pages/seller-partners/SellerPartnersDashboard';
import CommissionRules from './pages/seller-partners/CommissionRules';
import PartnerDashboard from './pages/partners/PartnerDashboard';
import PartnerClients from './pages/partners/PartnerClients';
import PartnerEarnings from './pages/partners/PartnerEarnings';
import PartnerPayouts from './pages/partners/PartnerPayouts';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout><Dashboard /></Layout>,
  },
  {
    path: '/portal-selector',
    element: <PortalSelector />,
  },
  {
    path: '/old',
    element: <Home />,
  },
  {
    path: '/products',
    element: <Layout><Products /></Layout>,
  },
  {
    path: '/products/:id',
    element: <Layout><ProductDetail /></Layout>,
  },
  {
    path: '/marking',
    element: <Layout><Marking /></Layout>,
  },
  {
    path: '/wizard',
    element: <Layout><DistributionWizard /></Layout>,
  },
  {
    path: '/history',
    element: <Layout><UploadHistory onBack={() => window.history.back()} /></Layout>,
  },
  {
    path: '/inventory',
    element: <Layout><ProductsInventory /></Layout>,
  },
  {
    path: '/transfer',
    element: <Layout><TransferCodes /></Layout>,
  },
  {
    path: '/upd',
    element: <Layout><UPDWork /></Layout>,
  },
  {
    path: '/pools',
    element: <Layout><div style={{ padding: '40px', textAlign: 'center' }}>Управление пулами КИЗ (в разработке)</div></Layout>,
  },
  {
    path: '/import-kiz',
    element: <ImportKIZ />,
  },
  {
    path: '/ai',
    element: <Layout><AIHub /></Layout>,
  },
  {
    path: '/ai/shipment-check',
    element: <Layout><ShipmentCheck /></Layout>,
  },
  {
    path: '/ai/upd-analyzer',
    element: <Layout><UPDAnalyzer /></Layout>,
  },
  {
    path: '/ai/recommendations',
    element: <Layout><div style={{ padding: '40px', textAlign: 'center' }}>Рекомендации AI (в разработке)</div></Layout>,
  },
  {
    path: '/ai/kiz-vault',
    element: <Layout><KIZVault /></Layout>,
  },
  {
    path: '/ai/kiz-vault/:id',
    element: <Layout><SKUDetails /></Layout>,
  },
  {
    path: '/ai/kiz-vault/replace',
    element: <Layout><ReplaceCodes /></Layout>,
  },
  {
    path: '/ai/analytics',
    element: <Layout><AIAnalytics /></Layout>,
  },
  {
    path: '/ai/analytics/result',
    element: <Layout><AIAnalyticsResult /></Layout>,
  },
  {
    path: '/planner',
    element: <Layout><AIPlannerDashboard /></Layout>,
  },
  {
    path: '/planner/shipments',
    element: <Layout><ShipmentsPlan /></Layout>,
  },
  {
    path: '/planner/production',
    element: <Layout><ProductionPlan /></Layout>,
  },
  {
    path: '/planner/kiz',
    element: <Layout><KIZPlan /></Layout>,
  },
  {
    path: '/seasonal',
    element: <Layout><SeasonalDashboard /></Layout>,
  },
  {
    path: '/seasonal/weekly-plan',
    element: <Layout><SeasonalWeeklyPlan /></Layout>,
  },
  {
    path: '/seasonal/scenarios',
    element: <Layout><SeasonScenarios /></Layout>,
  },
  {
    path: '/seasonal/production-capacity',
    element: <Layout><ProductionCapacity /></Layout>,
  },
  {
    path: '/autopilot/setup',
    element: <Layout><AutopilotSetup /></Layout>,
  },
  {
    path: '/autopilot/review',
    element: <Layout><AutopilotReview /></Layout>,
  },
  {
    path: '/autopilot/running',
    element: <Layout><AutopilotRunning /></Layout>,
  },
  {
    path: '/autopilot/result',
    element: <Layout><AutopilotResult /></Layout>,
  },
  {
    path: '/autopilot/objects',
    element: <Layout><AutopilotObjects /></Layout>,
  },
  {
    path: '/autopilot/constraints',
    element: <Layout><AutopilotConstraints /></Layout>,
  },
  {
    path: '/autopilot/policy-explanation',
    element: <Layout><PolicyExplanation /></Layout>,
  },
  {
    path: '/production-orders',
    element: <Layout><ProductionOrders /></Layout>,
  },
  {
    path: '/production-orders/create',
    element: <Layout><CreateProductionOrder /></Layout>,
  },
  {
    path: '/production-orders/:id',
    element: <Layout><ProductionOrderDetail /></Layout>,
  },
  // Production Portal (contractor cabinet)
  {
    path: '/production/orders',
    element: <ProductionOrdersList />,
  },
  {
    path: '/production/orders/:id',
    element: <ProductionOrderDetailPage />,
  },
  {
    path: '/production/calendar',
    element: <ProductionCalendar />,
  },
  {
    path: '/production/shipments',
    element: <ProductionShipments />,
  },
  {
    path: '/production/documents',
    element: <ProductionDocuments />,
  },
  {
    path: '/production/settings',
    element: <ProductionOrdersList />,
  },
  // Seller Partners (seller cabinet for partner management)
  {
    path: '/seller/partners',
    element: <Layout><SellerPartnersDashboard /></Layout>,
  },
  {
    path: '/seller/partners/rules',
    element: <Layout><CommissionRules /></Layout>,
  },
  // Partner Portal (partner's own cabinet)
  {
    path: '/partner/dashboard',
    element: <PartnerDashboard />,
  },
  {
    path: '/partner/clients',
    element: <PartnerClients />,
  },
  {
    path: '/partner/earnings',
    element: <PartnerEarnings />,
  },
  {
    path: '/partner/payouts',
    element: <PartnerPayouts />,
  },
  // Repricer History
  {
    path: '/repricer/history',
    element: <Layout><RepricerHistory /></Layout>,
  },
]);