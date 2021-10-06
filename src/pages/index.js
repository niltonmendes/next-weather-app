import Head from 'next/head';
import SearchBox from '../components/SearchBox';
import FamousPlaces from '../components/FamousPlaces';

export default function Home() {
  return (
    <>
      <Head>
        <title>Next Weather App</title>
      </Head>

      <div className="home">
        <div className="container">
          <SearchBox 
            placeholder="Digite sua cidade..."
          />
          <FamousPlaces />
        </div>
      </div>
    </>
      
  )
}
