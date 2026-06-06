import './Card.css';

type CardProps = {
  type: 'uncontrolled' | 'rhf';
  name: string;
  email: string;
  id: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  terms: boolean;
};

export const Card = ({ type, name, email, age, gender, terms }: CardProps) => {
  return (
    <div className="card">
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
        <b>Terms:</b> {terms ? 'Yes' : 'No'}
      </p>
    </div>
  );
};
