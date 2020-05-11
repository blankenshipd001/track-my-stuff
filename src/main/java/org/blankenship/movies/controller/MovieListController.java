package org.blankenship.movies.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.blankenship.movies.model.Movie;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.MediaType;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController //Marks this as a Controller that lets spring boot wire the endpoints
@RequestMapping("/movie") //Sets the endpoint
@Api(value = "/movie") //Swagger API endpoint documentation
public class MovieListController {

    @ApiOperation(value = "Retrive a single movie") //Description used in swagger api document
    @ApiResponses(value = { //Allows documenting the response if when it does not use the default message
            @ApiResponse(code = 200, message = "OK")
    })
    @GetMapping(value = "/movie", produces = MediaType.APPLICATION_JSON_UTF8_VALUE) //Get mapping used by Spring to map the API
    @ResponseBody ResponseEntity<Movie> movie() {
        return new ResponseEntity<Movie>(new Movie("Spider-Man: Homecoming"), HttpStatus.OK);
    }
}
