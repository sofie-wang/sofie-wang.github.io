// Source: Quantum Adventure portfolio, p. 8. Demo controls are not original rules.
export const effects = {
 energy:{name:'Energy station',icon:'ϟ',color:'#e0edce',description:'Gain one energy for each active token.'},
 superposition:{name:'Superposition',icon:'◒',color:'#f5edb8',description:'Gain a shield against one measurement.'},
 entanglement:{name:'Entanglement',icon:'∞',color:'#ead8ed',description:'Share energy gains and losses with the other player for three demo rolls.'},
 measurement:{name:'Measurement',icon:'◎',color:'#f6dfc8',description:'A measurement leaves one of the two tokens. Choose an outcome in this sandbox.'},
 event:{name:'Quantum event',icon:'?',color:'#e3dcf6',description:'Try the documented sample event: gain one energy. The full event deck is not reproduced.'}
};
export const tileTypes = Array.from({length:40},(_,i)=>['energy','superposition','measurement','energy','entanglement','event','energy','superposition','entanglement','measurement'][i%10]);
export const tokenNames=['A1','A2','B1','B2'];
