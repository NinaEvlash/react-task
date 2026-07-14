import Image from 'next/image';

import { getDataByName } from '@/api/dataApi';
import CloseDetailsButton from './CloseDetailsButton';

type Props = {
  name?: string;
};

export default async function DetailsPanel({ name }: Props) {
  if (!name) {
    return <div className="text-gray-500">Select Pokémon</div>;
  }

  const item = await getDataByName(name);

  return (
    <div className="flex flex-col items-center">
      <Image
        src={item.sprites.front_default ?? '/placeholder.png'}
        alt={item.name}
        width={160}
        height={160}
        priority
      />

      <h2 className="text-2xl font-bold capitalize mb-4">{item.name}</h2>

      <p>Height: {item.height}</p>
      <p>Weight: {item.weight}</p>
      <p>Types: {item.types.map((type) => type.type.name).join(', ')}</p>

      <CloseDetailsButton />
    </div>
  );
}
