import { CrewMember } from '@/types/CrewMember';
import { Ship } from '@/types/Ship';
import { UserMetadata } from '@/types/UserMetadata';
import { faker } from '@faker-js/faker';
import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 } from 'uuid';
import { supabase } from '../auth/[...supabase]';

const joinShip = async ({
  userId,
  shipCode,
}: {
  userId: string;
  shipCode: string;
}): Promise<Ship> => {
  const newCrewMember: CrewMember = {
    userId,
    ready: false,
  };

  const { data: ships, error: getShipError } = await supabase
    .from<Ship>(`Ship`)
    .select()
    .eq(`code`, shipCode)
    .select();

  if (getShipError) {
    throw new Error(JSON.stringify(getShipError));
  }

  const foundShip = ships[0];
  const shipId = foundShip.id;
  const currentCrew: CrewMember[] = foundShip.crew;

  const crewIsAlreadyInRoom = currentCrew
    .map((member) => member.userId)
    .includes(newCrewMember.userId);

  const userIsCaptain = foundShip.captain === userId;

  if (crewIsAlreadyInRoom || userIsCaptain) {
    return foundShip;
  }

  const { error: createMetadataError } = await supabase
    .from<UserMetadata>(`UserMetadata`)
    .insert({
      id: v4(),
      userId,
      shipId,
      nickname: faker.animal.bird(),
    });

  if (createMetadataError) {
    throw new Error(JSON.stringify(createMetadataError));
  }

  const { data, error } = await supabase
    .from(`Ship`)
    .update({
      crew: [...(currentCrew ?? []), newCrewMember],
    })
    .eq(`id`, shipId)
    .select();

  if (error) {
    throw new Error(JSON.stringify(error));
  }

  return data[0];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === `POST`) {
    const { userId, shipCode } = req.body;
    if (!userId || !shipCode) {
      return res.status(400).json(`Nope`);
    }

    try {
      const ship = await joinShip({
        userId,
        shipCode,
      });

      return res.status(200).json({
        captain: ship.captain,
        name: ship.name,
        id: ship.id,
      });
    } catch (err) {
      console.error(err);
      return res.status(400).json(err);
    }
  }

  return res.status(500);
}
