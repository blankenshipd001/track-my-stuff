package org.blankenship.movies.controller;

import com.fasterxml.jackson.annotation.JsonView;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import org.blankenship.movies.controller.views.View;
import org.blankenship.movies.model.Movie;
import org.blankenship.movies.model.MovieDTO;
import org.blankenship.movies.service.MovieService;
import org.blankenship.movies.util.DTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@Slf4j
@RestController //Marks this as a Controller that lets spring boot wire the endpoints
@RequestMapping("/movie") //Sets the endpoint
@Api(value = "/movie") //Swagger API endpoint documentation
public class MovieController {

    @Autowired
    MovieService movieService;

    @JsonView(View.Summary.class)
    @ApiOperation(value = "Retrieve all movies") //Description used in swagger api document
    @ApiResponses(value = { //Allows documenting the response if when it does not use the default message
            @ApiResponse(code = 200, message = "OK")
    })
    @GetMapping(value = "/list") //Get mapping used by Spring to map the API
    @ResponseBody ResponseEntity<List<Movie>> movie() {
        log.info("Obtain movie list");
        return new ResponseEntity<>(movieService.list(), HttpStatus.OK);
    }

    @ApiOperation(value = "Save movie") //Description used in swagger api document
    @ApiResponses(value = { //Allows documenting the response if when it does not use the default message
            @ApiResponse(code = 202, message = "Created")
    })
    @PostMapping(value = "/") //Get mapping used by Spring to map the API
    @ResponseBody ResponseEntity<Movie> saveMovie(@RequestBody @DTO(MovieDTO.class) Movie movie) {
        log.info("Saving a movie");
        return new ResponseEntity<>(movieService.save(movie), HttpStatus.CREATED);
    }
}
