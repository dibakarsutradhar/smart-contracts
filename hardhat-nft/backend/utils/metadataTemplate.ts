export interface metadataType {
  name: string;
  description: string;
  image?: string;
  attributes?: object;
}

export const metadataTemplate: metadataType = {
  name: '',
  description: '',
  image: '',
  attributes: [
    {
      trait_type: 'Cuteness',
      value: 100,
    },
  ],
};
