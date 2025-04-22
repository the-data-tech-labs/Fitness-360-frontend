import React, { useRef, useState, useEffect } from "react";
import { Box, Typography, Button, CardMedia, Card, CardContent, Grid } from "@mui/material";
import Services from "./Services";
import Footer from './footer';

const Dashboard = () => {
  const servicesRef = useRef(null);
  const whatWeOfferRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const [areCardsVisible, setAreCardsVisible] = useState(false);

  // Smooth scroll behavior for the entire page
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  // Scroll event listener for smooth transition
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Calculate scroll progress (0 to 1)
      const progress = scrollY / (documentHeight - windowHeight);
      setScrollProgress(progress);

      // Trigger animations based on scroll position
      if (servicesRef.current) {
        const servicesTop = servicesRef.current.getBoundingClientRect().top;
        const servicesProgress = Math.max(0, Math.min(1, (windowHeight - servicesTop) / windowHeight));
        servicesRef.current.style.transform = `scale(${0.9 + servicesProgress * 0.1})`;
        servicesRef.current.style.opacity = servicesProgress;
      }

      if (whatWeOfferRef.current) {
        const whatWeOfferTop = whatWeOfferRef.current.getBoundingClientRect().top;
        const whatWeOfferProgress = Math.max(0, Math.min(1, (windowHeight - whatWeOfferTop) / windowHeight));

        // Trigger title animation when section is 80% visible
        if (whatWeOfferTop < windowHeight * 0.8) {
          setIsTitleVisible(true);
        }

        // Trigger cards animation when section is 60% visible
        if (whatWeOfferTop < windowHeight * 0.6) {
          setAreCardsVisible(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100vh",
          overflow: "hidden",
          background: "linear-gradient(90deg, #2e003e, #000000)",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
          scrollSnapAlign: "start",
        }}
      >
        {/* Background Video */}
        <CardMedia
          component="video"
          autoPlay
          loop
          muted
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        >
          <source src="fitnessworkout.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </CardMedia>

        {/* Gradient Overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "linear-gradient(to right, rgba(46, 0, 62, 0.8), rgba(0, 0, 0, 0.5))",
            zIndex: 1,
          }}
        />

        {/* Hero Content */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "10%",
            transform: "translateY(-50%)",
            textAlign: "left",
            color: "#fff",
            zIndex: 2,
            maxWidth: "600px",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "2.5rem", md: "4rem" },
              animation: "slideInLeft 2s ease-out",
              "@keyframes slideInLeft": {
                "0%": { transform: "translateX(-100%)", opacity: 0 },
                "100%": { transform: "translateX(0)", opacity: 1 },
              },
            }}
          >
            Welcome to FitFlow
          </Typography>

          <Typography
            variant="h5"
            sx={{
              mt: 2,
              fontSize: { xs: "1.2rem", md: "1.5rem" },
              animation: "slideInRight 2s ease-out",
              animationDelay: "0.5s",
              "@keyframes slideInRight": {
                "0%": { transform: "translateX(100%)", opacity: 0 },
                "100%": { transform: "translateX(0)", opacity: 1 },
              },
            }}
          >
            Your journey to fitness and nutrition starts here!
          </Typography>

          <Button
            variant="contained"
            onClick={() => servicesRef.current?.scrollIntoView({ behavior: "smooth" })}
            sx={{
              mt: 4,
              backgroundColor: "#4a0066",
              fontSize: "1.2rem",
              padding: "10px 30px",
              "&:hover": {
                backgroundColor: "#6a0080",
                transform: "scale(1.1)",
                transition: "transform 0.3s ease",
              },
              transition: "background-color 0.3s ease",
            }}
          >
            Explore Our Services
          </Button>
        </Box>

        {/* Attractive Divider at the End of Hero Section */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "100px",
            background: "linear-gradient(to top, #2e003e, transparent)",
            zIndex: 2,
          }}
        />
      </Box>

      {/* Services Section */}
      <Box
        id="services-section"
        ref={servicesRef}
        sx={{
          position: "relative",
          width: "100%",
          minHeight: "100vh",
          background: "#ffffff",
          borderRadius: "40px 40px 0 0",
          transform: "scale(0.9)",
          transformOrigin: "top",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
          transition: "all 0.5s ease",
          zIndex: 2,
          overflow: "hidden",
          marginTop: "-20vh",
          opacity: 0, // Initial opacity for animation
          scrollSnapAlign: "start",
        }}
      >
        <Services />

        {/* Attractive Divider at the End of Services Section */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "100px",
            background: "linear-gradient(to top, #f5f5f5, transparent)",
            zIndex: 2,
          }}
        />
      </Box>

      {/* What We Offer Section */}
      <Box
        id="what-we-offer-section"
        ref={whatWeOfferRef}
        sx={{
          position: "relative",
          width: "100%",
          minHeight: "60vh", // Increased height for better card visibility
          background: "linear-gradient(135deg, #1a1a1a, #2e003e)", // Dark gradient
          padding: "60px 0 1cm", // 1cm space after cards
          scrollSnapAlign: "start",
          overflow: "hidden",
        }}
      >
        {/* Section Title */}
        <Typography
          variant="h3"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            color: "#ffffff",
            mb: 6,
            fontSize: { xs: "2rem", md: "3rem" },
            opacity: isTitleVisible ? 1 : 0,
            transform: isTitleVisible ? "translateY(0)" : "translateY(-20px)",
            transition: "opacity 1s ease, transform 1s ease", // Smooth transition
          }}
        >
          What We Offer
        </Typography>

        {/* Cards Grid */}
        <Grid container spacing={4} sx={{ px: 4 }}>
          {[
            {
              title: "Personal Training",
              description: "Customized workout plans tailored to your fitness goals.",
              icon: "💪",
              color: "#ff6f61",
            },
            {
              title: "Nutrition Plans",
              description: "Expert advice on diet and nutrition to complement your workouts.",
              icon: "🍎",
              color: "#6b5b95",
            },
            {
              title: "Group Classes",
              description: "Join our community and stay motivated with group fitness classes.",
              icon: "👥",
              color: "#88b04b",
            },
          ].map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "30px",
                  borderRadius: "20px",
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.2)",
                  opacity: areCardsVisible ? 1 : 0,
                  transform: areCardsVisible ? "scale(1)" : "scale(0.8)",
                  transition: "opacity 1s ease, transform 1s ease", // Smooth transition
                  transitionDelay: `${index * 0.2}s`, // Staggered animation
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0px 12px 40px rgba(0, 0, 0, 0.3)",
                  },
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    mb: 2,
                    color: item.color,
                    fontSize: { xs: "1.8rem", md: "2.2rem" },
                  }}
                >
                  {item.icon} {item.title}
                </Typography>
                <Typography variant="body1" sx={{ color: "#e0e0e0", fontSize: "1.1rem" }}>
                  {item.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Footer Section */}
      <Footer />

      {/* Scroll Progress Indicator */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: `${scrollProgress * 100}%`,
          height: "4px",
          backgroundColor: "#4a0066",
          zIndex: 1000,
        }}
      />

      {/* Custom Scrollbar */}
      <style>
        {`
          ::-webkit-scrollbar {
            width: 10px;
          }
          ::-webkit-scrollbar-track {
            background: #f1f1f1;
          }
          ::-webkit-scrollbar-thumb {
            background: #4a0066;
            border-radius: 5px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #6a0080;
          }
        `}
      </style>
    </>
  );
};

export default Dashboard;