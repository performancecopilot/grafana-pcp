import extensions from "../extensions";
import Q from "q";

describe('extensions', function() {

    const DATA_OVFS_NOINDOM = {
        "endpoint": "http://100.66.72.228:7402::1a4027b2f3aa",
        "metric": "titusovfs.read.latency",
        "datas": [
            [
                1558654097312.083,
                [
                    { "instance": 44, "value": 2, "instanceName": 44 },
                    { "instance": 45, "value": 6, "instanceName": 45 }
                ]
            ]
        ]
    }

    const DATA_OVFS_INDOM = {
        "endpoint": "http://100.119.81.199:7402::07fbdc6a-a1ce-4032-99d3-65fefc9e33e4",
        "metric": "titusovfs.write.latency",
        "datas": [
            [
                1558707668545.839,
                [
                    { "instance": 0, "value": 1, "instanceName": 0 },
                    { "instance": 1, "value": 1, "instanceName": 1 },
                    { "instance": 2, "value": 1, "instanceName": 2 },
                    { "instance": 3, "value": 9, "instanceName": 3 },
                    { "instance": 4, "value": 3, "instanceName": 4 },
                    { "instance": 5, "value": 7, "instanceName": 5 },
                    { "instance": 6, "value": 4, "instanceName": 6 },
                    { "instance": 7, "value": 74, "instanceName": 7 },
                    { "instance": 8, "value": 216, "instanceName": 8 },
                    { "instance": 9, "value": 1, "instanceName": 9 },
                    { "instance": 10, "value": 1, "instanceName": 10 },
                    { "instance": 11, "value": 17, "instanceName": 11 }
                ]
            ],
            [
                1558707669254.463,
                [
                    { "instance": 0, "value": 1, "instanceName": "07fbdc6a-a1ce-4032-99d3-65fefc9e33e4:8-16" },
                    { "instance": 1, "value": 1, "instanceName": "07fbdc6a-a1ce-4032-99d3-65fefc9e33e4:4-8" },
                    { "instance": 2, "value": 1, "instanceName": "78d3135c-b5c5-4401-9419-3bdf61c168eb:8-16" },
                    { "instance": 3, "value": 9, "instanceName": "7f93c224-61b6-4097-9172-0bf9c04d008b:16-32" },
                    { "instance": 4, "value": 3, "instanceName": "7f93c224-61b6-4097-9172-0bf9c04d008b:8-16" },
                    { "instance": 5, "value": 7, "instanceName": "7f93c224-61b6-4097-9172-0bf9c04d008b:4-8" },
                    { "instance": 6, "value": 4, "instanceName": "7f93c224-61b6-4097-9172-0bf9c04d008b:32-64" },
                    { "instance": 7, "value": 74, "instanceName": "7f93c224-61b6-4097-9172-0bf9c04d008b:0.5-1" },
                    { "instance": 8, "value": 216, "instanceName": "7f93c224-61b6-4097-9172-0bf9c04d008b:1-2" },
                    { "instance": 9, "value": 1, "instanceName": "7d083d61-825c-438a-a18e-201ff4e86c19:8-16" },
                    { "instance": 10, "value": 1, "instanceName": "7d083d61-825c-438a-a18e-201ff4e86c19:4-8" },
                    { "instance": 11, "value": 17, "instanceName": "7f93c224-61b6-4097-9172-0bf9c04d008b:2-4" }
                ]
            ],
            [
                1558707670076.66,
                [
                    { "instance": 0, "value": 1, "instanceName": "07fbdc6a-a1ce-4032-99d3-65fefc9e33e4:8-16" },
                    { "instance": 1, "value": 1, "instanceName": "07fbdc6a-a1ce-4032-99d3-65fefc9e33e4:4-8" },
                    { "instance": 3, "value": 7, "instanceName": "7f93c224-61b6-4097-9172-0bf9c04d008b:16-32" },
                    { "instance": 4, "value": 3, "instanceName": "7f93c224-61b6-4097-9172-0bf9c04d008b:8-16" },
                    { "instance": 5, "value": 3, "instanceName": "7f93c224-61b6-4097-9172-0bf9c04d008b:4-8" },
                    { "instance": 7, "value": 24, "instanceName": "7f93c224-61b6-4097-9172-0bf9c04d008b:0.5-1" },
                    { "instance": 8, "value": 137, "instanceName": "7f93c224-61b6-4097-9172-0bf9c04d008b:1-2" },
                    { "instance": 9, "value": 1, "instanceName": "7d083d61-825c-438a-a18e-201ff4e86c19:8-16" },
                    { "instance": 10, "value": 1, "instanceName": "7d083d61-825c-438a-a18e-201ff4e86c19:4-8" },
                    { "instance": 11, "value": 7, "instanceName": "7f93c224-61b6-4097-9172-0bf9c04d008b:2-4" }
                ]
            ],
            [
                1558707671475.903,
                [
                    { "instance": 0, "value": 1, "instanceName": "07fbdc6a-a1ce-4032-99d3-65fefc9e33e4:8-16" },
                    { "instance": 1, "value": 1, "instanceName": "07fbdc6a-a1ce-4032-99d3-65fefc9e33e4:4-8" },
                    { "instance": 2, "value": 1, "instanceName": "78d3135c-b5c5-4401-9419-3bdf61c168eb:8-16" },
                    { "instance": 3, "value": 14, "instanceName": "7f93c224-61b6-4097-9172-0bf9c04d008b:16-32" },
                    { "instance": 4, "value": 6, "instanceName": "7f93c224-61b6-4097-9172-0bf9c04d008b:8-16" },
                    { "instance": 5, "value": 4, "instanceName": "7f93c224-61b6-4097-9172-0bf9c04d008b:4-8" },
                    { "instance": 7, "value": 29, "instanceName": "7f93c224-61b6-4097-9172-0bf9c04d008b:0.5-1" },
                    { "instance": 8, "value": 263, "instanceName": "7f93c224-61b6-4097-9172-0bf9c04d008b:1-2" },
                    { "instance": 9, "value": 1, "instanceName": "7d083d61-825c-438a-a18e-201ff4e86c19:8-16" },
                    { "instance": 10, "value": 1, "instanceName": "7d083d61-825c-438a-a18e-201ff4e86c19:4-8" },
                    { "instance": 11, "value": 16, "instanceName": "7f93c224-61b6-4097-9172-0bf9c04d008b:2-4" },
                    { "instance": 12, "value": 1, "instanceName": 12 }
                ]
            ],
        ]
    }

    const DATA_OVFS_INDOM_EXPECTED = {
        "endpoint": "http://100.119.81.199:7402::07fbdc6a-a1ce-4032-99d3-65fefc9e33e4",
        "metric": "titusovfs.write.latency",
        "datas": [
            [
                1558707669254.463,
                [
                    { "instance": 0, "value": 1, "instanceName": "16" },
                    { "instance": 1, "value": 1, "instanceName": "8" },
                ]
            ],
            [
                1558707670076.66,
                [
                    { "instance": 0, "value": 1, "instanceName": "16" },
                    { "instance": 1, "value": 1, "instanceName": "8" },
                ]
            ],
            [
                1558707671475.903,
                [
                    { "instance": 0, "value": 1, "instanceName": "16" },
                    { "instance": 1, "value": 1, "instanceName": "8" },
                ]
            ],
        ]
    }



    const DATA_OTHER = {
        "endpoint": "http://100.66.72.228:7402::1a4027b2f3aa",
        "metric": "cgroup.cpuacct.usage",
        "datas": [
            [
                1558654034154.178,
                [
                    { "instance": 0, "value": 0, "instanceName": "zzzzz" }
                ]
            ],
            [
                1558654034940.031,
                [
                    { "instance": 0, "value": 0, "instanceName": "zzzz" }
                ]
            ],
            [
                1558654034154.178,
                [
                    { "instance": 0, "value": 0, "instanceName": "/docker/1a4027b2f3aaf5f77fe2fa42c8a12b0a169bcc6d7da1c709e5e2908d06f6e141" }
                ]
            ],
            [
                1558654034940.031,
                [
                    { "instance": 0, "value": 0, "instanceName": "/docker/1a4027b2f3aaf5f77fe2fa42c8a12b0a169bcc6d7da1c709e5e2908d06f6e141" }
                ]
            ]
        ]
    }


    describe('removeTitusTcCollected', function() {

    })

    describe('cleanTitusOvfsLatencyCollected', function() {
        it('allows other data to pass', function(done) {
            const input = DATA_OTHER
            const expected = DATA_OTHER
            const output = extensions.cleanTitusOvfsLatencyCollected(input, '1a4027b2f3aa')
            expect(output).to.deep.equal(expected)
            return done()
        })

        describe('without indom mapping', function() {
            it('allows no data to pass', function(done) {
                const input = DATA_OVFS_NOINDOM
                const expected = {
                    "endpoint": "http://100.66.72.228:7402::1a4027b2f3aa",
                    "metric": "titusovfs.read.latency",
                    "datas": []
                }
                const output = extensions.cleanTitusOvfsLatencyCollected(input, '1a4027b2f3aa')
                expect(output).to.deep.equal(expected)
                return done()
            })
        })

        describe('with indom mapping', function() {
            it('allows only container name', function(done) {
                const input = DATA_OVFS_INDOM
                const output = extensions.cleanTitusOvfsLatencyCollected(input, '07fbdc6a-a1ce-4032-99d3-65fefc9e33e4')
                expect(output).to.deep.equal(DATA_OVFS_INDOM_EXPECTED)
                return done()
            })
        })
    })
})
