const assert = require('assert');
const { readFileSync } = require('fs');
const { join } = require('path');
const { GearApi, GearKeyring, CreateType } = require('../lib/src');

after(() => {
    process.exit()
})

describe('GearApi test', () => {
    this.programs = new Map();

    before(async () => {
        this.gearApi = await GearApi.create();
        this.keyring = (await GearKeyring.create('test')).keyring;
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
        const code = readFileSync(join(process.env.EXAMPLES_DIR, 'demo_ping.wasm'))
        const program = {
            code,
            gasLimit: 10000000,
            value: 0,
        }
        let programId;
        it('submit', async () => {
            programId = await this.gearApi.program.submit(program)
            this.programs.set('demo_ping', {
                id: programId,
                meta: {
                    input: "String",
                    output: "String",
                }
            })
            assert.ok(programId)
        })
        it('signAndSend', async () => {
            await this.gearApi.program.signAndSend(this.keyring, (data) => {
                if (data.status === 'InBlock') {
                    assert.ok(true);
                }
            })
        })
        it('InitSuccess', async () => {
            await this.gearApi.gearEvents.subsribeProgramEvents((event) => {
                const data = event.data.toHuman()
                if (data[0].program_id, programId) {
                    this.programs['demo_ping'] = programId;
                    assert.ok(true);
                }
            })
        })
    })

    describe('Send message to demo_ping', () => {
        it('Submit', async () => {
            const message = {
                destination: this.programs.get('demo_ping').id,
                payload: 'PING',
                gasLimit: 10_000_000,
                value: 0
            }
            await this.gearApi.message.submit(message, this.programs.get('demo_ping').meta);
            assert.ok;
        });

        it('SignAndSend', async () => {
            await this.gearApi.message.signAndSend(this.keyring, (data) => {
                if (data.status === 'InBlock') {
                    messageId = data.messageId;
                    assert.ok(true);
                }
            })
        });
        it('Log', async () => {
            return new Promise((resolve, reject) => {
                this.gearApi.gearEvents.subscribeLogEvents((event) => {
                    const data = event.data[0].toHuman()
                    if (parseInt(data.reply[1]) === 0 && data.reply[0] === messageId) {
                        const decodedPayload = CreateType.decode(this.programs.get('demo_ping').meta.output, data.payload, this.programs.get('demo_ping').meta)
                        if (decodedPayload.toHuman() === 'PONG') {
                            resolve(assert.ok(true))
                        }
                    }
                })
            })
        });
    })
})


