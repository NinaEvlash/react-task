import { useEffect, useState } from 'react';
import './Card.css';

type CardProps = {
  type: 'uncontrolled' | 'rhf';
  name: string;
  email: string;
  id: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  terms: boolean;
  image: string;
  country: string;
};

export const Card = ({ type, name, email, age, gender, terms, image, country }: CardProps) => {
  const [isHighlighted, setIsHighlighted] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHighlighted(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <div className={`card ${isHighlighted ? 'card-new' : ''}`}>
      <img src={image} alt={name} className="card-image" />
      <p>
        <b>Type:</b> {type}
      </p>
      <p>
        <b>Name:</b> {name}
      </p>
      <p>
        <b>Email:</b> {email}
      </p>
      <p>
        <b>Age:</b> {age}
      </p>
      <p>
        <b>Gender:</b> {gender}
      </p>
      <p>
        <b>Country:</b> {country}
      </p>
      <p>
        <b>Terms:</b> {terms ? 'Yes' : 'No'}
      </p>
    </div>
  );
};
