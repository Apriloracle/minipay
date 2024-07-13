'use client'
import React, { useState, useEffect } from 'react';
import { createWalletClient, custom } from 'viem';
import { celo } from 'viem/chains';
import { Engine } from "@thirdweb-dev/engine";
import ScoreCard from './ScoreCard';

declare global {
    interface Window {
        ethereum: any;
    }
}

class Celon extends React.Component<{}, { address: string | null; error: string | null; score: number }> {
    private engine: Engine;

    constructor(props: {}) {
        super(props);
        this.state = { 
            address: null, 
            error: null,
            score: 0
        };

        this.engine = new Engine({
            url: "https://engine-production-9e7e.up.railway.app",
            accessToken: "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIweGU1MzdjZDVEREI5ZTQ4ZTdEYkMwMTk4RDU0Qjc3MjZEQjEzQjlBRTkiLCJzdWIiOiIweDMxQUI2MzdiRDMyNWI0QkY1MDE4YjM5REQxNTU2ODFEMDMzNDgxODkiLCJhdWQiOiJ0aGlyZHdlYi5jb20iLCJleHAiOjQ4NzQ1MDUxMDUsIm5iZiI6MTcyMDkwNTEwNSwiaWF0IjoxNzIwOTA1MTA1LCJqdGkiOiIyNjI1M2JiNS0yYjg0LTQwNjMtYmI4Mi1hZjAzZjM2NTQ1NTYiLCJjdHgiOnsicGVybWlzc2lvbnMiOiJBRE1JTiJ9fQ.MHhhYmIyMWI2NDNmODBmODA4MTk5NTE2MDNjYWY5YjExMzBiMTNiOTdjNmZiMDgwZDZjN2FlYjU1YjM1MGUyYzNlMmUyNWMwZTVlYzZmMTI5NGUxOGQxYzdmZGUyNzllODIzZTNiNDAwMWFlNjcyZGEzM2IyMDA2NDM1MWE1MDVmMTFi",
        });
    }

    componentDidMount() {
        this.fetchAddress();
    }

    async fetchAddress() {
        if (typeof window.ethereum !== 'undefined') {
            const client = createWalletClient({
                chain: celo,
                transport: custom(window.ethereum),
            });

            const addresses = await client.getAddresses();
            if (addresses && addresses.length > 0) {
                this.setState({ address: addresses[0] });
            }
        } else {
            console.error('Ethereum provider not found');
        }
    }

    async getAddress(): Promise<string | null> {
        if (!this.state.address) {
            await this.fetchAddress();
        }
        return this.state.address;
    }

    handleTransfer = async () => {
        try {
            const address = await this.getAddress();

            if (!address) {
                throw new Error("Celo address not found");
            }

            // First transfer
            await this.engine.erc20.transfer(
                "42220",
                "0x765DE816845861e75A25fCA122bb6898B8B1282a",
                "",
                {
                    toAddress: address,
                    amount: "0.0001",
                }
            );

            // Second transfer
            await this.engine.erc20.transfer(
                "42220",
                "0x18719D2e1e57A1A64708e4550fF3DEF9d1074621",
                "",
                {
                    toAddress: address,
                    amount: "0.01",
                }
            );

            // Increment the score
            this.setState(prevState => ({ score: prevState.score + 1, error: null }));

        } catch (err) {
            this.setState({ error: err instanceof Error ? err.message : String(err) });
        }
    };

    render() {
        const { address, error, score } = this.state;

        return (
     <div className='flex flex-col items-center space-y-4'>
                <div className='text-sm'>
                    {address ? `Celo Address: ${address}` : 'Loading...'}
                </div>
                <ScoreCard score={score} />
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#f05e23] to-[#d54d1b] rounded-full opacity-30 animate-ping"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#f05e23] to-[#d54d1b] rounded-full opacity-30 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    <button
                        onClick={this.handleTransfer}
                        className="relative w-52 h-52 bg-gradient-to-br from-[#f05e23] to-[#d54d1b] 
                            text-white rounded-full flex items-center justify-center 
                            text-lg font-bold transition-all duration-300 ease-in-out
                            shadow-[0_10px_20px_rgba(240,94,35,0.3)] 
                            hover:shadow-[0_15px_30px_rgba(240,94,35,0.5)]
                            active:shadow-[0_5px_10px_rgba(240,94,35,0.3)]
                            transform hover:-translate-y-1 active:translate-y-1
                            before:content-[''] before:absolute before:top-0 before:left-0 
                            before:w-full before:h-full before:rounded-full
                            before:bg-gradient-to-br before:from-white/20 before:to-transparent 
                            before:opacity-0 hover:before:opacity-100 before:transition-opacity
                            relative overflow-hidden"
                    >
                        Tap to earn
                    </button>
                </div>
                {error && (
                    <p className="text-red-500">Error: {error}</p>
                )}
            </div>
        );
    }
}

export default Celon;
