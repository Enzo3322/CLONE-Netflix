import React, { useEffect, useState } from "react";
import "./App.css";
import Tmdb from "./Tmdb";
import MovieRow from "./components/MovieRow/index";
import FeaturedMovie from "./components/FeaturedMovie/index";
import Header from "./components/Header/index";

export default () => {
  const [movieList, setMovieList] = useState([]);

  const [featuredData, setFeaturedData] = useState(null);

  const [blackHeader, setBlackHeader] = useState(false);

  //quando a tela é renderizada é executado todo conteudo dentro da sua função
  useEffect(() => {
    const loadAll = async () => {
      //puxando a lista total de filmes
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      //puxando o filme em destaque para exibir no FeaturedMovie
      let originals = list.filter((i) => i.slug === "originals");
      let randomChosen = Math.floor(
        Math.random() * (originals[0].items.results.length - 1)
      );
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, "tv");
      setFeaturedData(chosenInfo);
    };

    loadAll();
  }, []);

  //adicionando evento de monitoramento da pagina
  useEffect(() => {
    const scrollListner = () => {
      if (window.scrollY > 100) {
        setBlackHeader(true);
      } else {
        setBlackHeader(false);
      }
    };

    window.addEventListener("scroll", scrollListner);
    return () => {
      window.removeEventListener("sroll", scrollListner);
    };
  }, []);

  return (
    <div className="page">
      <Header black={blackHeader} />
      {featuredData && <FeaturedMovie item={featuredData} />}

      <section className="lists">
        {movieList.map((item, key) => (
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>
      <footer>
        Desenvolvido por Enzo Spagnolli <br />
        Base de dados Themoviedb.org
      </footer>

      {movieList.length <= 0 && (
        <div className="loading">
          <img
            src="https://media.filmelier.com/noticias/br/2020/03/Netflix_LoadTime.gif"
            alt="Carregando..."
          />
        </div>
      )}
    </div>
  );
};
