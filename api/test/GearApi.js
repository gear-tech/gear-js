const assert = require('assert');
const { readFileSync } = require('fs');
const { GearApi, GearKeyring } = require('../lib/src');

after(() => {
    process.exit()
})

describe('GearApi test', () => {
    before(async () => {
        this.gearApi = await GearApi.create();
        const { keyring } = await GearKeyring.create('test');
        this.keyring = keyring;
    })

    describe('GearApi', () => {
        it('Api connected', () => {
            assert.equal(this.gearApi.api.isConnected, true)
        })
    })

    describe('Keyring', () => {
        it('Keyring created', async () => {
            assert.ok(this.keyring);
        })
    })

    describe('Balance', () => {
        it('Transfer balance from Alice', async () => {
            await this.gearApi.balance.transferFromAlice(this.keyring.address, 9999999999999, (event) => {
                if (event === 'Transfer') {
                    assert.ok(true)
                }
            })
        })

        it('Get balance', async () => {
            const balance = await this.gearApi.balance.findOut(this.keyring.address)
            assert.ok(balance)
        })
    })


    describe('Total issuance', async () => {
        it('totalIssuance', () => {
            assert.doesNotThrow(() => { this.gearApi.totalIssuance(); })
        })
    })

    describe('Upload demo_ping', () => {
        const code = readFileSync('test/gear/examples/target/wasm32-unknown-unknown/release/demo_ping.wasm')
        const program = {
            code,
            gasLimit: 10000000,
            value: 0,
        }
        let programId;
        it('submit', async () => {
            programId = await this.gearApi.program.submit(program)
            assert.ok(programId)
        })
        it('signAndSend', async () => {
            await this.gearApi.program.signAndSend(this.keyring, (data) => {
                if (data.status === 'InBlock') {
                    assert.ok(true)
                }
            })
        })
        it('InitSuccess', async (done) => {
            this.gearApi.gearEvents.subsribeProgramEvents((event) => {
                const data = event.data.toHuman()
                assert.equal(data[0].program_id, programId)
            })
        })
    })
})


