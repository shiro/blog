import getArticlesSSG from "./getArticles.ssg";

const articles = compileTime(getArticlesSSG);

export const getArticles = () => articles.data;
