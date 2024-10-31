const Escrow = artifacts.require("Escrow");
const { toBN, toWei } = web3.utils;
const deposit = toWei("1");

contract("Escrow", function ([arbiter, beneficiary, depositor]) {
    let contract;
    beforeEach(async () => {
        contract = await Escrow.new(arbiter, beneficiary, {
            from: depositor,
            value: deposit
        });
    });

    it("should be funded", async () => {
        let balance = await web3.eth.getBalance(contract.address);
        assert.equal(balance.toString(), deposit.toString());
    });

    describe("after approval from address other than the arbiter", () => {
        it("should revert", async () => {
            let ex;
            try {
                await contract.approve({ from: beneficiary });
            }
            catch (_ex) {
                ex = _ex;
            }
            assert(ex, "Attempted to approve the Escrow from the beneficiary address. Expected transaction to revert!");
        });
    });

    describe("after approval from the arbiter", () => {
        it("should transfer balance to beneficiary", async () => {
            const before = toBN(await web3.eth.getBalance(beneficiary));
            const approve = await contract.approve({ from: arbiter });
            const after = toBN(await web3.eth.getBalance(beneficiary));
            assert.equal(after.sub(before).toString(), deposit.toString());
        });
    });
});
