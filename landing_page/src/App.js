import { useState, useEffect } from "react";
import "./App.css";
import Carousel from "react-bootstrap/Carousel";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [ratio, setRatio] = useState(window.innerWidth / window.innerHeight);
  const viewBreakpoint = 1;
  const carouselSizeBreakpoint = 1.3;
  const cardSizeBreakpoint = 0.62;

  useEffect(() => {
    window.addEventListener("resize", () =>
      setRatio(window.innerWidth / window.innerHeight)
    );
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img
          src="watermark.png"
          className="logo"
        />
        {ratio > viewBreakpoint && (
          <Carousel className="size-scrolling">
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="app_1_banner.png"
                alt="Simulation Atlas"
              />
              <Carousel.Caption>
                <a
                  className={
                    ratio < carouselSizeBreakpoint
                      ? "btn btn-lg btn-primary mb-3 small-font"
                      : "btn btn-lg btn-primary mb-3"
                  }
                  href="https://quakecoresoft.canterbury.ac.nz/sim_atlas"
                  role="button"
                >
                  Launch Simulation Atlas
                </a>
                <p
                  className={
                    ratio < carouselSizeBreakpoint
                      ? "dark small-font carousel-p"
                      : "dark carousel-p"
                  }
                >
                  Mapped active faults in New Zealand, their properties, and an
                  illustrative ground motion simulation for a potential major
                  earthquake on each fault.
                </p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="app_2_banner.png"
                alt="Vs30 Map"
              />

              <Carousel.Caption>
                <a
                  className={
                    ratio < carouselSizeBreakpoint
                      ? "btn btn-lg btn-primary mb-3 small-font"
                      : "btn btn-lg btn-primary mb-3"
                  }
                  href="https://quakecoresoft.canterbury.ac.nz/vs30"
                  role="button"
                >
                  Launch Vs30 Map
                </a>
                <p
                  className={
                    ratio < carouselSizeBreakpoint
                      ? "small-font carousel-p"
                      : "carousel-p"
                  }
                >
                  Vs30 models / categories, and measured sites.
                </p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="app_3_banner.jpg"
                alt="GMHazard"
              />

              <Carousel.Caption>
                <a
                  className={
                    ratio < carouselSizeBreakpoint
                      ? "btn btn-lg btn-primary mb-3 small-font"
                      : "btn btn-lg btn-primary mb-3"
                  }
                  href="https://quakecoresoft.canterbury.ac.nz/gmhazard"
                  role="button"
                >
                  Launch GMHazard
                </a>
                <p
                  className={
                    ratio < carouselSizeBreakpoint
                      ? "dark small-font carousel-p"
                      : "dark carousel-p"
                  }
                >
                  Calculation of Hazard Analysis at site specific locations
                  around New Zealand.
                </p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="app_4_banner.png"
                alt="Code Hazard"
              />

              <Carousel.Caption>
                <a
                  className={
                    ratio < carouselSizeBreakpoint
                      ? "btn btn-lg btn-primary mb-3 small-font"
                      : "btn btn-lg btn-primary mb-3"
                  }
                  href="https://quakecoresoft.canterbury.ac.nz/code_hazard"
                  role="button"
                >
                  Launch Code Hazard
                </a>
                <p
                  className={
                    ratio < carouselSizeBreakpoint
                      ? "small-font carousel-p"
                      : "carousel-p"
                  }
                >
                  Displays NZS1170.5 Hazard Map information across New Zealand.
                </p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="app_5_banner.jpg"
                alt="VsViewer"
              />

              <Carousel.Caption>
                <a
                  className={
                    ratio < carouselSizeBreakpoint
                      ? "btn btn-lg btn-primary mb-3 small-font"
                      : "btn btn-lg btn-primary mb-3"
                  }
                  href="https://quakecoresoft.canterbury.ac.nz/vs_viewer"
                  role="button"
                >
                  Launch VsViewer
                </a>
                <p
                  className={
                    ratio < carouselSizeBreakpoint
                      ? "dark small-font carousel-p"
                      : "dark carousel-p"
                  }
                >
                  Visualising CPT / SPT / VsProfiles to infer informed Vs30
                  values.
                </p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        )}
        {ratio <= viewBreakpoint && (
          <div>
            <div className="card mb-3 d-sm-block mx-2">
              <img
                src="app_1_banner.png"
                class="card-img-top"
                alt="simulation atlas"
              />
              <div className="card-body centre-text">
                <a
                  className={
                    ratio < cardSizeBreakpoint
                      ? "btn btn-lg btn-primary mb-3 card-btn small-font"
                      : "btn btn-lg btn-primary mb-3 card-btn"
                  }
                  href="https://quakecoresoft.canterbury.ac.nz/sim_atlas"
                  role="button"
                >
                  Launch Simulation Atlas
                </a>
                <p
                  className={
                    ratio < cardSizeBreakpoint ? "small-font card-p" : "card-p"
                  }
                >
                  Mapped active faults in New Zealand, their properties, and an
                  illustrative ground motion simulation for a potential major
                  earthquake on each fault.
                </p>
              </div>
            </div>
            <div className="card mb-3 d-sm-block mx-2">
              <img src="app_2_banner.png" alt="Vs30 Map" class="card-img-top" />
              <div className="card-body centre-text">
                <a
                  className={
                    ratio < cardSizeBreakpoint
                      ? "btn btn-lg btn-primary mb-3 card-btn small-font"
                      : "btn btn-lg btn-primary mb-3 card-btn"
                  }
                  href="https://quakecoresoft.canterbury.ac.nz/vs30"
                  role="button"
                >
                  Launch Vs30 Map
                </a>
                <p
                  className={
                    ratio < cardSizeBreakpoint ? "small-font card-p" : "card-p"
                  }
                >
                  Vs30 models / categories, and measured sites.
                </p>
              </div>
            </div>
            <div className="card mb-3 d-sm-block mx-2">
              <img src="app_3_banner.jpg" alt="GMHazard" class="card-img-top" />
              <div className="card-body centre-text">
                <a
                  className={
                    ratio < cardSizeBreakpoint
                      ? "btn btn-lg btn-primary mb-3 card-btn small-font"
                      : "btn btn-lg btn-primary mb-3 card-btn"
                  }
                  href="https://quakecoresoft.canterbury.ac.nz/gmhazard"
                  role="button"
                >
                  Launch GMHazard
                </a>
                <p
                  className={
                    ratio < cardSizeBreakpoint ? "small-font card-p" : "card-p"
                  }
                >
                  Calculation of Hazard Analysis at site specific locations
                  around New Zealand.
                </p>
              </div>
            </div>
            <div className="card mb-3 d-sm-block mx-2">
              <img
                src="app_4_banner.png"
                alt="Code Hazard"
                class="card-img-top"
              />
              <div className="card-body centre-text">
                <a
                  className={
                    ratio < cardSizeBreakpoint
                      ? "btn btn-lg btn-primary mb-3 card-btn small-font"
                      : "btn btn-lg btn-primary mb-3 card-btn"
                  }
                  href="https://quakecoresoft.canterbury.ac.nz/code_hazard"
                  role="button"
                >
                  Launch Code Hazard
                </a>
                <p
                  className={
                    ratio < cardSizeBreakpoint ? "small-font card-p" : "card-p"
                  }
                >
                  Displays NZS1170.5 Hazard Map information across New Zealand.
                </p>
              </div>
            </div>
            <div className="card mb-3 d-sm-block mx-2">
              <img src="app_5_banner.jpg" alt="VsViewer" class="card-img-top" />
              <div className="card-body centre-text">
                <a
                  className={
                    ratio < cardSizeBreakpoint
                      ? "btn btn-lg btn-primary mb-3 card-btn small-font"
                      : "btn btn-lg btn-primary mb-3 card-btn"
                  }
                  href="https://quakecoresoft.canterbury.ac.nz/vs_viewer"
                  role="button"
                >
                  Launch VsViewer
                </a>
                <p
                  className={
                    ratio < cardSizeBreakpoint ? "small-font card-p" : "card-p"
                  }
                >
                  Visualising CPT / SPT / VsProfiles to infer informed Vs30
                  values.
                </p>
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
