package org.blankenship.movies.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.blankenship.movies.model.Movie;
import org.blankenship.movies.service.MovieService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.hamcrest.Matchers.containsString;

import static org.mockito.Mockito.when;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class MovieControllerTest {

    private MockMvc mockMvc;

    @Mock
    private MovieService movieService;

    @InjectMocks
    private MovieController movieController;

    @BeforeEach
    public void init() {
        MockitoAnnotations.initMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(movieController).build();
    }

    @Test
    public void getMovieListReturnsMovies() throws Exception {
        List<Movie> movies = getMovies();

        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(movies);

        when(movieService.list()).thenReturn(movies);

        mockMvc.perform(get("/movie/list")
                .contentType(MediaType.APPLICATION_JSON)
                .characterEncoding("utf-8")
        ).andExpect(status().isOk())
        .andExpect(content().string(containsString(json)));

        verify(movieService, times(1)).list();
    }

    private List<Movie> getMovies() {
        return Stream.of(
                new Movie("5ebdb4e64ca824ceca95acff", "Evil Dead", 2013, "R", "91", "Fede Alvarez", "evil dead plot", "evil dead poster"),
                new Movie("5ebdb4e64ca824ceca95ade6", "Thor: The Dark World", 2013, "PG-13", "112", "Alan Taylor", "Thor plot", "Thor poster")
        ).collect(Collectors.toList());
    }
}
