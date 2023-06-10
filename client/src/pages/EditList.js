import { Chip, OutlinedInput, ThemeProvider, Typography } from "@mui/material";
import theme from "../../../utils/Themes";
import Header from "../../header/Header";
import Footer from "../../footer/Footer";
import styles from "./EditList.module.css";
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";

const EditList = () => {
  const [selectedMovies, setSelectedMovies] = useState([]);
  console.log("Select", selectedMovies);
  const [movies, setMovies] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const location = useLocation();
  const lists_list = location.state?.list;
  const [listMovies, setListMovies] = useState([]);
  let select = selectedMovies.map((movie) => movie);
  console.log(lists_list.ListID);
  console.log(lists_list.Title);
  useEffect(() => {
    const fetchListsData = async () => {
      try {
        const listId = lists_list?.ListID;
        const responseList = await axios.get(`/api/getListData/${listId}`);
        setList(responseList.data);
        setTitle(responseList.data[0].ListTitle);
        setDescription(responseList.data[0].ListDescription);
      } catch (error) {
        console.error("Error fetching Lists Data", error);
      }
    };
    fetchListsData();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`/api/getAllMovies`);
        setMovies(response.data.results);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    const fetchListsMovies = async () => {
      try {
        const ListId = lists_list?.ListID;
        const responseMovies = await axios.get(
          `/api/getListsMovies/${lists_list.ListID}`
        );
        setListMovies(responseMovies.data);
        console.log(responseMovies.data);
        setSelectedMovies(responseMovies.data);
      } catch (error) {
        console.error("Error fetching Lists Movies", error);
      }
    };
    fetchListsMovies();
  }, []);

  const handleMovieSelect = (event) => {
    const movie = event.target.value;

    // Check if the movie is already selected
    const isSelected = selectedMovies.some(
      (selectedMovie) => selectedMovie.MovieId === movie.MovieId
    );

    if (isSelected) {
      // If the movie is already selected, remove it from the array
      const updatedMovies = selectedMovies.filter(
        (selectedMovie) => selectedMovie.MovieId !== movie.MovieId
      );
      setSelectedMovies(updatedMovies);
    } else {
      // If the movie is not selected, add it to the array
      setSelectedMovies([...selectedMovies, movie]);
    }
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleAddList = async (event) => {
    event.preventDefault();

    if (!title || !description || selectedMovies.length === 0) {
      toast.error("Please fill in the fields");
    } else {
      const cookies = new Cookies();
      const token = cookies.get("token");
      const { UserID } = token[0];
      try {
        await axios
          .put(`/api/editList/${lists_list.ListID}`, {
            title,
            description,
            selectedMovies,
          })
          .then(() => {
            navigate("/userlists");
          });
      } catch (error) {
        console.error("Error updating list:", error);
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundImage: `linear-gradient(to top, rgba(26, 26, 36), rgba(22, 22, 28))`,
        }}
      >
        <Header />
        <ToastContainer />
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "16px",
          }}
        >
          <form
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              width: "400px",
            }}
            onSubmit={handleAddList}
          >
            <Typography variant="h6" color="#ebebeb">
              Edit List
            </Typography>
            <TextField
              id="username"
              name="username"
              variant="filled"
              color="secondary"
              value={title}
              onChange={handleTitleChange}
              InputProps={{
                style: {
                  backgroundColor: "#ebebeb",
                  borderRadius: "5px",
                  width: "400px",
                },
              }}
            />
            <TextField
              id="description"
              name="description"
              variant="filled"
              color="secondary"
              multiline
              rows={4}
              value={description}
              onChange={handleDescriptionChange}
              InputProps={{
                style: {
                  backgroundColor: "#ebebeb",
                  borderRadius: "5px",
                  width: "400px",
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#293e3c",
                "&:hover": {
                  backgroundColor: "#2a9d8f",
                },
              }}
            >
              Add
            </Button>
          </form>

          <Box mt={6.2} ml={5} borderRadius={1} padding={1}>
            <FormControl
              sx={{
                m: 1,
                width: 300,
                backgroundColor: "#ebebeb",
                borderRadius: "5px",
              }}
            >
              <InputLabel id="demo-multiple-chip-label">Chip</InputLabel>
              <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={selectedMovies}
                onChange={handleMovieSelect}
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                renderValue={(movies) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {movies.map((movie, index) => (
                      <Chip key={movie.MovieId} label={movie.Title} />
                    ))}
                  </Box>
                )}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: "150px",
                    },
                  },
                }}
              >
                {movies.map((movie, index) => (
                  <MenuItem key={movie.MovieId} value={movie}>
                    {movie.Title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default EditList;