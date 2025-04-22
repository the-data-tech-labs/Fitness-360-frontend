// import React, { useState, useEffect } from "react";
// import {
//   TextField,
//   Button,
//   Box,
//   Typography,
//   CircularProgress,
//   InputAdornment,
//   Checkbox,
//   FormControlLabel,
//   Link,
//   Alert,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faUser,
//   faLock,
//   faRulerVertical,
//   faWeightScale,
//   faVenusMars,
//   faBirthdayCake,
// } from "@fortawesome/free-solid-svg-icons";
// import { motion } from "framer-motion";

// const Signin = ({ handleLogin }) => {
//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//     rememberMe: false,
//   });
//   const [error, setError] = useState({ username: "", password: "" });
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const [rememberedUsername, setRememberedUsername] = useState("");

//   // State for additional info and pop-up
//   const [additionalData, setAdditionalData] = useState({
//     height: "",
//     weight: "",
//     gender: "",
//     age: "",
//   });
//   const [additionalErrors, setAdditionalErrors] = useState({
//     height: "",
//     weight: "",
//     gender: "",
//     age: "",
//   });
//   const [isPopupOpen, setIsPopupOpen] = useState(false);

//   useEffect(() => {
//     // Check if "Remember Me" is enabled and restore the username
//     const rememberMe = localStorage.getItem("rememberMe");
//     const username = localStorage.getItem("username");
//     if (rememberMe === "true" && username) {
//       setFormData((prevData) => ({
//         ...prevData,
//         username: username,
//         rememberMe: true,
//       }));
//       setRememberedUsername(username);
//     }
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, checked, type } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//     setError({ username: "", password: "" });
//   };

//   const handleSignIn = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError({ username: "", password: "" });

//     try {
//       const response = await axios.post("http://127.0.0.1:8000/api/users/login/", {
//         username: formData.username,
//         password: formData.password,
//       });

//       const { access: accessToken, refresh: refreshToken } = response.data;

//       // Save tokens to localStorage
//       localStorage.setItem("access_token", accessToken);
//       localStorage.setItem("refresh_token", refreshToken);

//       // Handle "Remember Me" functionality
//       if (formData.rememberMe) {
//         localStorage.setItem("rememberMe", "true");
//         localStorage.setItem("username", formData.username);
//       } else {
//         localStorage.removeItem("rememberMe");
//         localStorage.removeItem("username");
//       }

//       // Fetch profile data
//       const profileResponse = await axios.get("http://127.0.0.1:8000/api/profile/", {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       });

//       // Call handleLogin to update isLoggedIn state in App.js
//       handleLogin({
//         username: formData.username,
//         accessToken: accessToken,
//         refreshToken: refreshToken,
//         profile: profileResponse.data, // Add profile data to userData
//       });

//       // Redirect to dashboard
//       navigate("/dashboard");
//     } catch (err) {
//       setIsLoading(false);
//       console.error("Login Error:", err.response?.data);
//       setError({
//         username: err.response?.data?.username || "",
//         password: err.response?.data?.password || "Invalid credentials",
//       });
//     }
//   };

//   const handleForgotPassword = () => {
//     navigate("/forgot-password");
//   };

//   const handleAdditionalChange = (e) => {
//     const { name, value } = e.target;
//     setAdditionalData({ ...additionalData, [name]: value });
//     setAdditionalErrors({ ...additionalErrors, [name]: "" });
//   };

//   const handleAdditionalSubmit = async () => {
//     const accessToken = localStorage.getItem("access_token");

//     // Validate inputs
//     const heightError = validateHeight(additionalData.height);
//     const weightError = validateWeight(additionalData.weight);
//     const ageError = validateAge(additionalData.age);
//     const genderError = !additionalData.gender ? "Please select a gender." : "";

//     if (heightError || weightError || ageError || genderError) {
//       setAdditionalErrors({
//         height: heightError,
//         weight: weightError,
//         age: ageError,
//         gender: genderError,
//       });
//       return;
//     }

//     try {
//       await axios.put(
//         "http://127.0.0.1:8000/api/profile/",
//         {
//           height: additionalData.height,
//           weight: additionalData.weight,
//           gender: additionalData.gender,
//           age: additionalData.age,
//         },
//         {
//           headers: { Authorization: `Bearer ${accessToken}` },
//         }
//       );

//       // Close the pop-up and redirect to the dashboard
//       setIsPopupOpen(false);
//       alert("Profile updated successfully!");
//       navigate("/dashboard");
//     } catch (err) {
//       console.error("Additional Info Error:", err.response?.data);
//       if (err.response) {
//         setAdditionalErrors({
//           height: err.response.data.height || "",
//           weight: err.response.data.weight || "",
//           gender: err.response.data.gender || "",
//           age: err.response.data.age || "",
//         });
//       }
//     }
//   };

//   // Validation functions
//   const validateHeight = (height) => {
//     if (isNaN(height) || height <= 0) {
//       return "Please enter a valid height.";
//     }
//     return "";
//   };

//   const validateWeight = (weight) => {
//     if (isNaN(weight) || weight <= 0) {
//       return "Please enter a valid weight.";
//     }
//     return "";
//   };

//   const validateAge = (age) => {
//     if (isNaN(age) || age <= 0) {
//       return "Please enter a valid age.";
//     }
//     return "";
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         minHeight: "100vh",
//         padding: "20px",
//       }}
//     >
//       <motion.div
//         initial={{ opacity: 0, y: -50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         style={{ width: "100%", maxWidth: "700px", textAlign: "center" }}
//       >
//         <Typography
//           variant="h4"
//           component="h1"
//           sx={{
//             fontWeight: "bold",
//             mb: 4,
//             color: "#7b1fa2",
//             fontSize: { xs: "28px", sm: "32px" },
//           }}
//         >
//           Welcome Back
//         </Typography>
//         {error.username || error.password ? (
//           <Alert severity="error" sx={{ mb: 2 }}>
//             {error.username || error.password}
//           </Alert>
//         ) : null}
//         <form onSubmit={handleSignIn}>
//           <Box sx={{ mb: 3 }}>
//             <TextField
//               fullWidth
//               name="username"
//               label="Username"
//               variant="outlined"
//               margin="normal"
//               value={formData.username}
//               onChange={handleChange}
//               error={!!error.username}
//               helperText={error.username}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <FontAwesomeIcon icon={faUser} style={{ color: "#7b1fa2" }} />
//                   </InputAdornment>
//                 ),
//               }}
//               required
//             />
//           </Box>
//           <Box sx={{ mb: 3 }}>
//             <TextField
//               fullWidth
//               name="password"
//               label="Password"
//               type="password"
//               variant="outlined"
//               margin="normal"
//               value={formData.password}
//               onChange={handleChange}
//               error={!!error.password}
//               helperText={error.password}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <FontAwesomeIcon icon={faLock} style={{ color: "#7b1fa2" }} />
//                   </InputAdornment>
//                 ),
//               }}
//               required
//             />
//           </Box>
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               mb: 3,
//             }}
//           >
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   name="rememberMe"
//                   checked={formData.rememberMe}
//                   onChange={handleChange}
//                   color="primary"
//                 />
//               }
//               label="Remember Me"
//             />
//             <Link
//               component="button"
//               variant="body2"
//               onClick={handleForgotPassword}
//               sx={{ color: "#7b1fa2", textDecoration: "none" }}
//             >
//               Forgot Password?
//             </Link>
//           </Box>
//           <Button
//             type="submit"
//             variant="contained"
//             fullWidth
//             sx={{
//               mt: 2,
//               backgroundColor: "#7b1fa2",
//               color: "white",
//               "&:hover": { backgroundColor: "#e91e63" },
//               padding: "12px",
//               fontSize: "16px",
//               fontWeight: "bold",
//               textTransform: "none",
//               borderRadius: "8px",
//             }}
//             disabled={isLoading}
//           >
//             {isLoading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
//           </Button>
//         </form>
//       </motion.div>

//       {/* Pop-up for additional info */}
//       <Dialog open={isPopupOpen} onClose={() => setIsPopupOpen(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>
//           <Typography variant="h6" component="h2" sx={{ fontWeight: "bold", color: "#7b1fa2" }}>
//             Additional Information
//           </Typography>
//         </DialogTitle>
//         <DialogContent>
//           <Box sx={{ mb: 3 }}>
//             <TextField
//               fullWidth
//               name="height"
//               label="Height (cm)"
//               variant="outlined"
//               margin="normal"
//               value={additionalData.height}
//               onChange={handleAdditionalChange}
//               error={!!additionalErrors.height}
//               helperText={additionalErrors.height}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <FontAwesomeIcon icon={faRulerVertical} style={{ color: "#7b1fa2" }} />
//                   </InputAdornment>
//                 ),
//               }}
//               required
//             />
//           </Box>
//           <Box sx={{ mb: 3 }}>
//             <TextField
//               fullWidth
//               name="weight"
//               label="Weight (kg)"
//               variant="outlined"
//               margin="normal"
//               value={additionalData.weight}
//               onChange={handleAdditionalChange}
//               error={!!additionalErrors.weight}
//               helperText={additionalErrors.weight}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <FontAwesomeIcon icon={faWeightScale} style={{ color: "#7b1fa2" }} />
//                   </InputAdornment>
//                 ),
//               }}
//               required
//             />
//           </Box>
//           <Box sx={{ mb: 3 }}>
//             <FormControl fullWidth variant="outlined" margin="normal" error={!!additionalErrors.gender}>
//               <InputLabel>Gender</InputLabel>
//               <Select
//                 name="gender"
//                 value={additionalData.gender || ""}
//                 onChange={handleAdditionalChange}
//                 label="Gender"
//                 required
//               >
//                 <MenuItem value="Male">Male</MenuItem>
//                 <MenuItem value="Female">Female</MenuItem>
//                 <MenuItem value="Other">Other</MenuItem>
//               </Select>
//               {additionalErrors.gender && <Typography color="error">{additionalErrors.gender}</Typography>}
//             </FormControl>
//           </Box>
//           <Box sx={{ mb: 3 }}>
//             <TextField
//               fullWidth
//               name="age"
//               label="Age"
//               variant="outlined"
//               margin="normal"
//               value={additionalData.age}
//               onChange={handleAdditionalChange}
//               error={!!additionalErrors.age}
//               helperText={additionalErrors.age}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <FontAwesomeIcon icon={faBirthdayCake} style={{ color: "#7b1fa2" }} />
//                   </InputAdornment>
//                 ),
//               }}
//               required
//             />
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setIsPopupOpen(false)} color="secondary">
//             Cancel
//           </Button>
//           <Button onClick={handleAdditionalSubmit} color="primary">
//             Submit
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default Signin;

import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Link,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faRulerVertical,
  faWeightScale,
  faVenusMars,
  faBirthdayCake,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { toast } from "react-toastify"; // Add toast notifications

const Signin = ({ handleLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [rememberedUsername, setRememberedUsername] = useState("");

  // State for additional info and pop-up
  const [additionalData, setAdditionalData] = useState({
    height: "",
    weight: "",
    gender: "",
    age: "",
  });
  const [additionalErrors, setAdditionalErrors] = useState({
    height: "",
    weight: "",
    gender: "",
    age: "",
  });
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    // Check if "Remember Me" is enabled and restore the username
    const rememberMe = localStorage.getItem("rememberMe");
    const username = localStorage.getItem("username");
    if (rememberMe === "true" && username) {
      setFormData((prevData) => ({
        ...prevData,
        username: username,
        rememberMe: true,
      }));
      setRememberedUsername(username);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setError({ username: "", password: "" });
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError({ username: "", password: "" });

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/users/login/", {
        username: formData.username,
        password: formData.password,
      });

      const { access: accessToken, refresh: refreshToken } = response.data;

      // Save tokens to localStorage
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      // Handle "Remember Me" functionality
      if (formData.rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("username", formData.username);
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("username");
      }

      // Fetch profile data
      const profileResponse = await axios.get("http://127.0.0.1:8000/api/profile/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Check if profile is complete
      const profile = profileResponse.data;
      if (!profile.height || !profile.weight || !profile.gender || !profile.age) {
        setIsPopupOpen(true);
        setAdditionalData({
          height: profile.height || "",
          weight: profile.weight || "",
          gender: profile.gender || "",
          age: profile.age || "",
        });
        return;
      }

      // Call handleLogin to update isLoggedIn state in App.js
      handleLogin({
        username: formData.username,
        accessToken: accessToken,
        refreshToken: refreshToken,
        profile: profileResponse.data,
      });

      // Redirect to dashboard
      navigate("/dashboard");
      toast.success("Login successful!");
    } catch (err) {
      setIsLoading(false);
      console.error("Login Error:", err.response?.data);
      
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.password?.[0] || 
                          "Invalid credentials";
      
      setError({
        username: err.response?.data?.username || "",
        password: errorMessage,
      });
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleAdditionalChange = (e) => {
    const { name, value } = e.target;
    setAdditionalData({ ...additionalData, [name]: value });
    setAdditionalErrors({ ...additionalErrors, [name]: "" });
  };

  const handleAdditionalSubmit = async () => {
    const accessToken = localStorage.getItem("access_token");

    // Validate inputs
    const heightError = validateHeight(additionalData.height);
    const weightError = validateWeight(additionalData.weight);
    const ageError = validateAge(additionalData.age);
    const genderError = !additionalData.gender ? "Please select a gender." : "";

    if (heightError || weightError || ageError || genderError) {
      setAdditionalErrors({
        height: heightError,
        weight: weightError,
        age: ageError,
        gender: genderError,
      });
      return;
    }

    try {
      await axios.put(
        "http://127.0.0.1:8000/api/profile/",
        {
          height: additionalData.height,
          weight: additionalData.weight,
          gender: additionalData.gender,
          age: additionalData.age,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      // Fetch updated profile data
      const profileResponse = await axios.get("http://127.0.0.1:8000/api/profile/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Update user data and close popup
      handleLogin({
        username: formData.username,
        accessToken: accessToken,
        refreshToken: localStorage.getItem("refresh_token"),
        profile: profileResponse.data,
      });

      setIsPopupOpen(false);
      toast.success("Profile updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Additional Info Error:", err.response?.data);
      if (err.response) {
        setAdditionalErrors({
          height: err.response.data.height || "",
          weight: err.response.data.weight || "",
          gender: err.response.data.gender || "",
          age: err.response.data.age || "",
        });
        toast.error("Failed to update profile. Please check your inputs.");
      }
    }
  };

  // Validation functions
  const validateHeight = (height) => {
    if (isNaN(height) || height <= 0) {
      return "Please enter a valid height.";
    }
    return "";
  };

  const validateWeight = (weight) => {
    if (isNaN(weight) || weight <= 0) {
      return "Please enter a valid weight.";
    }
    return "";
  };

  const validateAge = (age) => {
    if (isNaN(age) || age <= 0) {
      return "Please enter a valid age.";
    }
    return "";
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "20px",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: "100%", maxWidth: "500px", textAlign: "center" }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            padding: { xs: "20px", sm: "40px" },
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: "bold",
              mb: 4,
              color: "#7b1fa2",
              fontSize: { xs: "28px", sm: "32px" },
            }}
          >
            Welcome Back
          </Typography>
          {error.username || error.password ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error.username || error.password}
            </Alert>
          ) : null}
          <form onSubmit={handleSignIn}>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                name="username"
                label="Username"
                variant="outlined"
                margin="normal"
                value={formData.username}
                onChange={handleChange}
                error={!!error.username}
                helperText={error.username}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon icon={faUser} style={{ color: "#7b1fa2" }} />
                    </InputAdornment>
                  ),
                }}
                required
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                name="password"
                label="Password"
                type="password"
                variant="outlined"
                margin="normal"
                value={formData.password}
                onChange={handleChange}
                error={!!error.password}
                helperText={error.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon icon={faLock} style={{ color: "#7b1fa2" }} />
                    </InputAdornment>
                  ),
                }}
                required
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 3,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label="Remember Me"
              />
              <Link
                component="button"
                variant="body2"
                onClick={handleForgotPassword}
                sx={{ 
                  color: "#7b1fa2", 
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" }
                }}
              >
                Forgot Password?
              </Link>
            </Box>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                backgroundColor: "#7b1fa2",
                color: "white",
                "&:hover": { backgroundColor: "#6a1b9a" },
                padding: "12px",
                fontSize: "16px",
                fontWeight: "bold",
                textTransform: "none",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
            </Button>
          </form>
        </Box>
      </motion.div>

      {/* Pop-up for additional info */}
      <Dialog 
        open={isPopupOpen} 
        onClose={() => setIsPopupOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            padding: "20px",
          }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" component="h2" sx={{ fontWeight: "bold", color: "#7b1fa2" }}>
            Complete Your Profile
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Please provide some additional information to personalize your experience.
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3, mt: 2 }}>
            <TextField
              fullWidth
              name="height"
              label="Height (cm)"
              variant="outlined"
              margin="normal"
              value={additionalData.height}
              onChange={handleAdditionalChange}
              error={!!additionalErrors.height}
              helperText={additionalErrors.height}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FontAwesomeIcon icon={faRulerVertical} style={{ color: "#7b1fa2" }} />
                  </InputAdornment>
                ),
              }}
              required
            />
          </Box>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              name="weight"
              label="Weight (kg)"
              variant="outlined"
              margin="normal"
              value={additionalData.weight}
              onChange={handleAdditionalChange}
              error={!!additionalErrors.weight}
              helperText={additionalErrors.weight}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FontAwesomeIcon icon={faWeightScale} style={{ color: "#7b1fa2" }} />
                  </InputAdornment>
                ),
              }}
              required
            />
          </Box>
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth variant="outlined" margin="normal" error={!!additionalErrors.gender}>
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={additionalData.gender || ""}
                onChange={handleAdditionalChange}
                label="Gender"
                required
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
                <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
              </Select>
              {additionalErrors.gender && (
                <Typography variant="caption" color="error">
                  {additionalErrors.gender}
                </Typography>
              )}
            </FormControl>
          </Box>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              name="age"
              label="Age"
              variant="outlined"
              margin="normal"
              value={additionalData.age}
              onChange={handleAdditionalChange}
              error={!!additionalErrors.age}
              helperText={additionalErrors.age}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FontAwesomeIcon icon={faBirthdayCake} style={{ color: "#7b1fa2" }} />
                  </InputAdornment>
                ),
              }}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ padding: "20px" }}>
          <Button 
            onClick={() => setIsPopupOpen(false)} 
            color="secondary"
            sx={{ 
              color: "#7b1fa2",
              "&:hover": { backgroundColor: "rgba(123, 31, 162, 0.08)" }
            }}
          >
            Skip for Now
          </Button>
          <Button 
            onClick={handleAdditionalSubmit} 
            variant="contained"
            sx={{ 
              backgroundColor: "#7b1fa2",
              "&:hover": { backgroundColor: "#6a1b9a" }
            }}
          >
            Save & Continue
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Signin;