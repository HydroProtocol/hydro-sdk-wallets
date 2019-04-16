import { HydroWallet } from ".";

it("create", async () => {
  const hydroWallet = await HydroWallet.createRandom();
  await hydroWallet.save("password");
  expect(HydroWallet.list().length).toBeGreaterThan(0);
});

it("unlock", async () => {
  const hydroWallet = HydroWallet.list()[0];
  expect(hydroWallet._wallet).toEqual(undefined);
  try {
    await hydroWallet.unlock("wrongpassword");
  } catch (e) {
    expect(e.message).toEqual("invalid password");
  }
  expect(hydroWallet._wallet).toEqual(undefined);
  await hydroWallet.unlock("password");
  expect(hydroWallet._wallet!.address.toLowerCase()).toEqual(
    hydroWallet._address
  );
});
