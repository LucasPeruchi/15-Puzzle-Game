import axios from "axios";
import { api } from "../env";

export const saveScore = (user) => {
    return axios.post(`${api}/ranking`, user);
};

export const getMovesScores = () => {
    return axios.get(`${api}/ranking?sortBy=count&order=asc`);
};

export const getTimesScores = () => {
    return axios.get(`${api}/ranking?sortBy=time&order=asc`);
};