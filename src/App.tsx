import { Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Leadership from "@/pages/Leadership";
import Books from "@/pages/Books";
import Programs from "@/pages/Programs";
import GraceBridge from "@/pages/GraceBridge";
import TheProblem from "@/pages/TheProblem";
import OurSolution from "@/pages/OurSolution";
import ImpactTransparency from "@/pages/ImpactTransparency";
import GetInvolved from "@/pages/GetInvolved";
import Volunteer from "@/pages/Volunteer";
import Donate from "@/pages/Donate";
import DonateSuccess from "@/pages/DonateSuccess";
import DonateCancel from "@/pages/DonateCancel";
import Campaigns from "@/pages/Campaigns";
import CampaignDetail from "@/pages/CampaignDetail";
import Contact from "@/pages/Contact";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Terms from "@/pages/Terms";
import NotFound from "@/pages/NotFound";
import DynamicPage from "@/pages/DynamicPage";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminOverview from "@/pages/admin/AdminOverview";
import AdminDonations from "@/pages/admin/AdminDonations";
import AdminContacts from "@/pages/admin/AdminContacts";
import AdminVolunteers from "@/pages/admin/AdminVolunteers";
import AdminCampaigns from "@/pages/AdminCampaigns";
import AdminHomePage from "@/pages/admin/AdminHomePage";
import AdminAboutPage from "@/pages/admin/AdminAboutPage";
import AdminLeadershipPage from "@/pages/admin/AdminLeadershipPage";
import AdminBooksPage from "@/pages/admin/AdminBooksPage";
import AdminProgramsPage from "@/pages/admin/AdminProgramsPage";
import AdminGraceBridgePage from "@/pages/admin/AdminGraceBridgePage";
import AdminTheProblemPage from "@/pages/admin/AdminTheProblemPage";
import AdminOurSolutionPage from "@/pages/admin/AdminOurSolutionPage";
import AdminImpactPage from "@/pages/admin/AdminImpactPage";
import AdminGetInvolvedPage from "@/pages/admin/AdminGetInvolvedPage";
import AdminLayoutContentPage from "@/pages/admin/AdminLayoutContentPage";
import AdminCustomPagesListPage from "@/pages/admin/AdminCustomPagesListPage";
import AdminCustomPageEditor from "@/pages/admin/AdminCustomPageEditor";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { GlobalNgoJsonLd } from "@/components/ui/Seo";
import { AuthProvider, RequireAuth } from "@/auth/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <GlobalNgoJsonLd />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="about/leadership" element={<Leadership />} />
          <Route path="about/books" element={<Books />} />
          <Route path="programs" element={<Programs />} />
          <Route path="programs/grace-bridge" element={<GraceBridge />} />
          <Route path="programs/grace-bridge/problem" element={<TheProblem />} />
          <Route path="programs/grace-bridge/solution" element={<OurSolution />} />
          <Route path="impact" element={<ImpactTransparency />} />
          <Route path="get-involved" element={<GetInvolved />} />
          <Route path="volunteer" element={<Volunteer />} />
          <Route path="donate" element={<Donate />} />
          <Route path="donate/success" element={<DonateSuccess />} />
          <Route path="donate/cancel" element={<DonateCancel />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="c/:slug" element={<CampaignDetail />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<Terms />} />
          <Route path=":slug" element={<DynamicPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin: standalone (no public Layout), JWT-protected. */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<AdminOverview />} />
          <Route path="donations" element={<AdminDonations />} />
          <Route path="contacts" element={<AdminContacts />} />
          <Route path="volunteers" element={<AdminVolunteers />} />
          <Route path="campaigns" element={<AdminCampaigns />} />
          <Route path="pages/home" element={<AdminHomePage />} />
          <Route path="pages/about" element={<AdminAboutPage />} />
          <Route path="pages/leadership" element={<AdminLeadershipPage />} />
          <Route path="pages/books" element={<AdminBooksPage />} />
          <Route path="pages/programs" element={<AdminProgramsPage />} />
          <Route path="pages/grace-bridge" element={<AdminGraceBridgePage />} />
          <Route path="pages/the-problem" element={<AdminTheProblemPage />} />
          <Route path="pages/our-solution" element={<AdminOurSolutionPage />} />
          <Route path="pages/impact" element={<AdminImpactPage />} />
          <Route path="pages/get-involved" element={<AdminGetInvolvedPage />} />
          <Route path="pages/layout" element={<AdminLayoutContentPage />} />
          <Route path="pages-custom" element={<AdminCustomPagesListPage />} />
          <Route path="pages-custom/:id" element={<AdminCustomPageEditor />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
