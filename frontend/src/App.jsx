import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Brands from './pages/Brands.jsx';
import BrandDetail from './pages/BrandDetail.jsx';
import Tractors from './pages/Tractors.jsx';
import TractorDetail from './pages/TractorDetail.jsx';
import Compare from './pages/Compare.jsx';
import Used from './pages/Used.jsx';
import UsedDetail from './pages/UsedDetail.jsx';
import Sell from './pages/Sell.jsx';
import EMI from './pages/EMI.jsx';
import Implements from './pages/Implements.jsx';
import ImplementDetail from './pages/ImplementDetail.jsx';
import Dealers from './pages/Dealers.jsx';
import News from './pages/News.jsx';
import NewsDetail from './pages/NewsDetail.jsx';
import Videos from './pages/Videos.jsx';
import Admin from './pages/Admin.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/brands" element={<Brands />} />
        <Route path="/brand/:slug" element={<BrandDetail />} />
        <Route path="/tractors" element={<Tractors />} />
        <Route path="/tractor/:slug" element={<TractorDetail />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/used" element={<Used />} />
        <Route path="/used/:id" element={<UsedDetail />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/emi" element={<EMI />} />
        <Route path="/implements" element={<Implements />} />
        <Route path="/implements/:slug" element={<ImplementDetail />} />
        <Route path="/dealers" element={<Dealers />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:slug" element={<NewsDetail />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/admin" element={<Admin />} />
      </Route>
    </Routes>
  );
}
