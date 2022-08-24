import Link from 'next/link';

const Home = () => {
  return (
    <div>
      <Link href="sign-typed-data">Sign Typed Data</Link>
      <Link href="ecrecover">ecrecover</Link>
    </div>
  );
};

export default Home;
