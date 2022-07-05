Moralis.Cloud.afterSave('ItemListed', async (request) => {
  const confirmed = request.object.get('confirmed');
  const logger = Moralis.Cloud.getLogger();
  logger.info('Looking for confirmed Tx');

  if (confirmed) {
    logger.info('Found Item!');
    const ActiveItem = Moralis.Object.extend('ActiveItem');

    const activeItem = new ActiveItem();
    activeItem.set('marketplaceAddress', request.object.get('address'));
    activeItem.set('nftAddress', request.object.get('nftAddress'));
    activeItem.set('price', request.object.get('price'));
    activeItem.set('tokenId', request.object.get('tokenId'));
    activeItem.set('seller', request.object.get('seller'));

    logger.info(
      `Adding Address: ${request.object.get(
        'address'
      )}, Token Id: ${request.object.get('tokenId')}`
    );
    logger.info('Saving...');
    await activeItem.save();
  }
});

Moralis.Cloud.afterSave('ItemCanceled', async (request) => {
  const confirmed = request.object.get('confirmed');
  const logger = Moralis.Cloud.getLogger();
  logger.info(`Marketplace | Object: ${request.object}`);

  if (confirmed) {
    const ActiveItem = Moralis.Object.extend('ActiveItem');
    const query = new Moralis.Query(ActiveItem);
    query.equalTo('marketplaceAddress', request.object.get('address'));
    query.equalTo('nftAddress', request.object.get('nftAddress'));
    query.equalTo('tokenId', request.object.get('tokenId'));

    logger.info(`Marketplace | Query: ${query}`);
    const canceledItem = await query.first();
    logger.info(`Marketplace | Canceled Item: ${canceledItem}`);
    if (canceledItem) {
      logger.info(
        `Deleteing ${request.object.get(
          'tokenId'
        )} at address ${request.object.get('address')} since it was canceled`
      );
      await canceledItem.destroy();
    } else {
      logger.info(
        `No item found with address ${request.object.get(
          'address'
        )} and tokenId ${request.object.get('tokenId')}`
      );
    }
  }
});
