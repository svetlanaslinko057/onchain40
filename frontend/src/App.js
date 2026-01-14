import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";

// Pages
import ArkhamHome from "./pages/ArkhamHome";
import TokensPage from "./pages/TokensPage";
import TokenDetail from "./pages/TokenDetail";
import WalletsPage from "./pages/WalletsPage";
import Portfolio from "./pages/Portfolio";
import EntitiesPage from "./pages/EntitiesPage";
import EntityDetail from "./pages/EntityDetail";
import SignalsPage from "./pages/SignalsPage";
import SignalSnapshot from "./pages/SignalSnapshot";
import AlertsPageNew from "./pages/AlertsPageNew";
import StrategiesPage from "./pages/StrategiesPage";
import WatchlistPage from "./pages/WatchlistPage";
import ActorsPage from "./pages/ActorsPage";
import ActorProfile from "./pages/ActorProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Navigation */}
        <Route path="/" element={<ArkhamHome />} />
        <Route path="/tokens" element={<TokensPage />} />
        <Route path="/wallets" element={<WalletsPage />} />
        <Route path="/entities" element={<EntitiesPage />} />
        <Route path="/signals" element={<SignalsPage />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
        <Route path="/alerts" element={<AlertsPageNew />} />
        <Route path="/strategies" element={<StrategiesPage />} />
        <Route path="/actors" element={<ActorsPage />} />
        <Route path="/actors/:actorId" element={<ActorProfile />} />
        
        {/* Detail Pages */}
        <Route path="/token/:tokenId" element={<TokenDetail />} />
        <Route path="/portfolio/:address" element={<Portfolio />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/entity/:entityId" element={<EntityDetail />} />
        <Route path="/signal/:id" element={<SignalSnapshot />} />
        
        {/* Fallback */}
        <Route path="/*" element={<ArkhamHome />} />
      </Routes>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;
