import React from 'react';
import Head from 'next/head';
import moment from 'moment-timezone';
import Link from 'next/link';
import TodaysWeather from '../../components/TodaysWeather';
import HourlyWeather from '../../components/HourlyWeather';
import WeeklyWeather from '../../components/WeeklyWeather';
import SearchBox from '../../components/SearchBox';

import cities from '../../lib/city.list.json';
import 'moment/locale/pt-br';

export default function City({ 
    hourlyWeather, 
    currentWeather, 
    dailyWeather, 
    city,
    timezone,
}) {
    return (
        <>
            <Head>
                <title>{city.name} Weather - Next Weather App</title>
            </Head>
            <div className="page-wrapper">
                <div className="container">
                    <Link href="/">
                        <a className="back-link">
                            &larr; Home
                        </a>
                    </Link>
                    <SearchBox 
                        placeholder="Procure por outra cidade..."
                    />
                    <TodaysWeather 
                        city={city}
                        weather={dailyWeather[0]}
                        timezone={timezone}
                    />
                    <HourlyWeather 
                        hourlyWeather={hourlyWeather}
                        timezone={timezone}
                    />
                    <WeeklyWeather 
                        weeklyWeather={dailyWeather}
                        timezone={timezone}
                    />
                </div>
            </div>
        </>
    )
}

const getCity = param => {
    const cityParam = param.trim();
    const splitCity = cityParam.split("-");
    const id = splitCity[splitCity.length -1];

    if( !id ) {
        return null;
    }

    const city = cities.find(city => city.id.toString() == id);

    if ( city ) {
        return city;
    } else {
        return null;
    }
}

export async function getServerSideProps(context) {
    const city = getCity(context.params.city);
    
    if( !city ) {
        return {
            notFound: true,
        }
    }

    const getHourlyWeather = (hourlyData, timezone) => {
        const endOfDay = moment().tz(timezone).endOf('day').valueOf();
        const eodTimeStamp = Math.floor(endOfDay / 1000);

        const todaysData = hourlyData.filter(data => data.dt < eodTimeStamp);

        return todaysData;
    }

    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${city.coord.lat}&lon=${city.coord.lon}&appid=${process.env.WEATHER_APP_KEY}&units=metric&exclude=minutely&lang=pt_br`);
    const data = await response.json();
    
    if ( !data ) {
        return {
            notFound: true,
        }
    }

    const hourlyWeather = getHourlyWeather(data.hourly, data.timezone);

    return {
        props: {
            city,
            timezone: data.timezone,
            currentWeather: data.current,
            dailyWeather: data.daily,
            hourlyWeather,
        }
    }
}