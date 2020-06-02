package org.blankenship.movies.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.blankenship.movies.model.Movie;
import org.blankenship.movies.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController //Marks this as a Controller that lets spring boot wire the endpoints
@RequestMapping("/movie") //Sets the endpoint
@Api(value = "/movie") //Swagger API endpoint documentation
public class MovieListController {

    @Autowired
    MovieService movieService;

    @ApiOperation(value = "Retrieve all movies") //Description used in swagger api document
    @ApiResponses(value = { //Allows documenting the response if when it does not use the default message
            @ApiResponse(code = 200, message = "OK")
    })
    @GetMapping(value = "/list") //Get mapping used by Spring to map the API
    @ResponseBody ResponseEntity<List<Movie>> movie() {
        return new ResponseEntity<>(movieService.list(), HttpStatus.OK);
    }
}
