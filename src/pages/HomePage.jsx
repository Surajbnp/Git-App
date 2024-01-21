import React, { useState, useEffect } from "react";
import styles from "../styles/homepage.module.css";
import axios from "axios";
import { BallTriangle } from "react-loader-spinner";
import { FaLocationDot } from "react-icons/fa6";
import { FaTwitter } from "react-icons/fa";
import { IoLink } from "react-icons/io5";
import RepoCard from "../components/RepoCard";
import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";

const HomePage = () => {
  const [username, setuserName] = useState("");
  const [loader, setLoader] = useState(false);
  const [currentUser, setCurrentuser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [reposPerPage, setPerPage] = useState(10);
  const [totalRepos, setTotalRepos] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  const handleSubmit = (e) => {
    let userName = username;
    if (e.keyCode === 13 && userName) {
      setLoader(true);
      axios
        .get(`https://api.github.com/users/${userName}`, {
          headers: {
            Authorization: "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",
            Accept: "application/vnd.github.v3+json",
          },
        })
        .then((res) => {
          if (res.status === 200) {
            setCurrentuser(res.data);
            fetchUserRepo(
              `${res.data.repos_url}?per_page=${reposPerPage}&page=1`
            );
            setTotalRepos(res.data.public_repos);
            setLoader(false);
            setuserName("");
          }
        })
        .catch((err) => {
          setLoader(false);
          console.log(err);
        });
    }
  };

  const handleResultPerPage = (e) => {
    let value = Number(e.target.value);
    let totalPage = Math.ceil(value);
    let url = `https://api.github.com/users/Surajbnp/repos?per_page=${value}&page=${currentPage}`;
    setPerPage(value);
    fetchUserRepo(url);
  };

  const fetchUserRepo = (url) => {
    axios.get(url).then((res) => {
      if (res.status === 200) {
        setRepos(res.data);
      }
    });
  };

  const handleNextPage = () => {
    let maxPage = Number(Math.ceil(totalRepos / reposPerPage));
    if (currentPage < maxPage) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      let url = `https://api.github.com/users/Surajbnp/repos?per_page=${reposPerPage}&page=${nextPage}`;
      fetchUserRepo(url);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(Number(prevPage));
      let url = `https://api.github.com/users/Surajbnp/repos?per_page=${reposPerPage}&page=${prevPage}`;
      fetchUserRepo(url);
    }
  };


  useEffect(() => {
    let totalpage = Math.ceil(totalRepos / reposPerPage);
    setTotalPage(totalpage);
  }, [reposPerPage]);

  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <div>
          <img
            width={"40px"}
            src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png"
            alt="logo"
          />
        </div>
        <div>
          <input
            onChange={(e) => setuserName(e.target.value)}
            className={styles.searchBar}
            type="text"
            placeholder="enter github username"
            onKeyDown={handleSubmit}
          />
        </div>
      </div>

      {currentUser ? (
        <div className={styles.infoContainer}>
          <div className={styles.profile}>
            <div className={styles.profileLogo}>
              <img
                width={"100%"}
                src={currentUser?.avatar_url}
                alt="profile.logo"
              />
            </div>

            <div className={styles.profileInfo}>
              <p>{currentUser?.name}</p>
              <p>{currentUser?.login}</p>
              <p>{currentUser?.bio}</p>
              <div className={styles.flex}>
                <FaLocationDot />
                <p>{currentUser?.location ? currentUser?.location : "N/A"}</p>
              </div>
              <div className={styles.flex}>
                <FaTwitter />
                <p>
                  {currentUser?.twitter_username
                    ? currentUser?.twitter_username
                    : "N/A"}
                </p>
              </div>
              <div className={styles.flex}>
                <IoLink />
                <p>{currentUser?.html_url}</p>
              </div>
            </div>
          </div>
          <div className={styles.repos}>
            <div className={styles.searchRepo}>
              <input type="text" placeholder="Find a repository..." />
              <select
                onChange={handleResultPerPage}
                defaultValue={reposPerPage}
              >
                <option value="" disabled>
                  Result/Page
                </option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>

            <div className={styles.reposContainer}>
              {repos.length &&
                repos.map((e) => {
                  return <RepoCard {...e} />;
                })}
            </div>
            <div className={styles.paginationDiv}>
              <div className={styles.paginationBtn}>
                <div onClick={handlePrevPage}>{<GrFormPrevious />}</div>
                <div>{`${currentPage}/${totalPage}`}</div>
                <div onClick={handleNextPage}>{<MdNavigateNext />}</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {loader ? (
            <BallTriangle
              height={100}
              width={100}
              radius={5}
              color="grey"
              ariaLabel="loading"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          ) : (
            <div>
              {currentUser === null ? (
                <p className={styles.alertTxt}>{"No User Found !"}</p>
              ) : (
                <p className={styles.alertTxt}>{"Search For User !"}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
