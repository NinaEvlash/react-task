import './Card.css';

type CardProps = {
  type: 'uncontrolled' | 'rhf';
  name: string;
  email: string;
  id: string;
};

export const Card = ({ type, name, email }: CardProps) => {
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
    </div>
  );
};
