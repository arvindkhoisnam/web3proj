import CardDemo from "./Card";

function Feature() {
  return (
    <div className="bg-neutral-900">
      <div className="max-w-7xl mx-auto bg-neutral-900 py-32 px-20 flex flex-col gap-10">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-5 border border-neutral-700 p-6 rounded-xl">
          <CardDemo
            title={"Manage Wallets"}
            imageUrl={
              "https://media.istockphoto.com/id/1386739357/photo/wallet-and-digital-security-online-payment-and-cyber-protection.jpg?s=2048x2048&w=is&k=20&c=6-kFNl114GEA0dhOUStWMpeXsNZeN4_NygqLY5lNDu8="
            }
          />
          <div className="p-6 rounded-xl">
            <h2 className="text-sm md:text-md lg:text-xl text-neutral-400 text-center">
              You can now safely manage all your wallets under one parent
              wallet. Makes life easier and less chaotic.
            </h2>
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row justify-center items-center gap-5 border border-neutral-700 p-6 rounded-xl">
          <div className="p-6 rounded-xl">
            <h2 className="text-sm md:text-md lg:text-xl text-neutral-400 text-center">
              Owning your own custom token and minting it can now be a reality
              with AllSol.
            </h2>
          </div>
          <CardDemo
            title={"Custom Tokens"}
            imageUrl={
              "https://media.istockphoto.com/id/1366571792/photo/bitcoins-with-a-pickaxe.jpg?s=2048x2048&w=is&k=20&c=gRyYg_lKNkAQjiZaZvqo1EhbIfij5IDmpTf2liFLC0Y="
            }
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-5 border border-neutral-700 p-6 rounded-xl">
          <CardDemo
            title={"Airdrop/dApp"}
            imageUrl={
              "https://media.istockphoto.com/id/1367699775/photo/nft-non-fungible-token-golden-coins-falling-trendy-cryptocurrencies-and-coins-on-the.jpg?s=2048x2048&w=is&k=20&c=soA6I6ONJc5Ctcq6ymGVjlgE5nfLgKyMm3WfJRkd3vo="
            }
          />
          <div className="p-6 rounded-xl">
            <h2 className="text-sm md:text-md lg:text-xl text-neutral-400 text-center">
              We provide airdropping service in devnet mode. Connect your wallet
              from your favourite crypto wallet service.
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feature;
