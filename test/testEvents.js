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

    it("should default the isApproved state to false", async () => {
        const isApproved = await contract.isApproved();
        assert(!isApproved, "Expected isApproved to be false!");
    });

    describe("after approval from the arbiter", () => {
        let before;
        let tx;
        beforeEach(async () => {
            before = toBN(await web3.eth.getBalance(beneficiary));
            tx = await contract.approve({ from: arbiter });
        });

        it("should transfer balance to beneficiary", async () => {
            const after = toBN(await web3.eth.getBalance(beneficiary));
            assert.equal(after.sub(before).toString(), deposit.toString());
        });

        it("should emit the event", async () => {
            const event = tx.receipt.logs.find(x => x.event === "Approved");
            assert(event, "Expect an Approved event to be emitted!");
            const amount = event.args[0];
            assert.equal(
                amount.toString(), deposit.toString(),
                "Expected the deposit amount to be emitted in the Approved event!"
            );
        });

        it("should set the isApproved state to true", async () => {
            const isApproved = await contract.isApproved();
            assert(isApproved, "Expected isApproved to be true!");
        });
    });
});
