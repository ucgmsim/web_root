import Box from "@mui/material/Box";
import GlobalStyles from "@mui/material/GlobalStyles";
import AboutSection from "./components/AboutSection";
import Footer from "./components/Footer";
import FundingSection from "./components/FundingSection";
import Hero from "./components/Hero";
import ToolDirectory from "./components/ToolDirectory";
import TopBar from "./components/TopBar";

const globalStyles = {
  "@media (prefers-reduced-motion: no-preference)": { html: { scrollBehavior: "smooth" } },
};

const skipLinkSx = {
  position: "absolute",
  left: 16,
  top: -48,
  zIndex: 2000,
  px: 2,
  py: 1,
  borderRadius: 2,
  bgcolor: "primary.main",
  color: "primary.contrastText",
  fontWeight: 600,
  "&:focus": { top: 12 },
};

export default function App() {
  return (
    <Box id="top">
      <GlobalStyles styles={globalStyles} />
      <Box component="a" href="#tools" sx={skipLinkSx}>
        Skip to tools
      </Box>
      <TopBar />
      <main>
        <Hero />
        <ToolDirectory />
        <AboutSection />
        <FundingSection />
      </main>
      <Footer />
    </Box>
  );
}
