import React from "react";
import styles from "../styles/repocard.module.css";

const RepoCard = ({ name, visibility, language, description }) => {
  return (
    <div className={styles.container}>
      <div>
        <p className={styles.name}>{name}</p>
        <p>{visibility}</p>
      </div>
      <p>{description ? description : "No description"}</p>
      <div>
        <p>{language}</p>
      </div>
    </div>
  );
};

export default RepoCard;
