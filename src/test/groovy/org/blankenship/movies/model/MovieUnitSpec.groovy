//package org.blankenship.movies.model
//
//import org.springframework.test.context.ActiveProfiles
//import org.testng.annotations.Test
//import spock.lang.Specification
//
//@ActiveProfiles("dev")
//class MovieUnitSpec extends Specification {
//
//    @Test
//    void 'a basic model constructor'() {
//        given: 'a Movie with the title of Spider-Man: Homecoming'
//            Movie movie = new Movie('Spider-Man: Homecoming')
//
//        when: 'getting the title'
//            String title = movie.getTitle()
//
//        then: 'title should be the same'
//            assert title == 'Spider-Man: Homecoming'
//
//        and: 'toString() should contain the title'
//            assert movie.toString().contains('Spider-Man: Homecoming')
//    }
//}
