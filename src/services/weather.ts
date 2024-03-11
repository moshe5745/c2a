import axios from "axios";

const getWeather = (city: string) => {
  const result = axios.get(
    `https://api.weatherapi.com/v1/current.json?q=${city}&key=ecc909ad4e544fdb80885245241103`
  );

  return result;
};

export default getWeather;
