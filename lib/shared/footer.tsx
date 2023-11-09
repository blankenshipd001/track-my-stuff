/**
 * TODO: 
 *  Make sticky? -> Maybe? 
 *  Update with any links
 *  Disclosures etc
 *  Copyrights
 *  Thanks you
 * 
 * @returns Footer 
 */
const Footer = () => {
  return (
    // <!--Footer container-->
    <footer className="text-center text-white">
        
      {/* <!--Copyright section--> */}
      <div className="p-4 text-center" style={{"backgroundColor": '#1A1A1A'}}>
        © 2023 Copyright:
        <a className="text-white" href="https://github.com/blankenshipd001">
          &nbsp;Code-Monkey
        </a>
        < br />
        <a className="text-white text-xs" href="https://github.com/blankenshipd001">
          This product uses the TMDB API but is not endorsed or certified by TMDB.
          <br /> 
          This product uses the Just Watch API but is not endorsed or certified by Just Watch.
        </a>
      </div>
    </footer>
  );
};

export default Footer;
