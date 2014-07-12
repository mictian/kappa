{"filter":false,"title":"specGrammar.js","tooltip":"/tests/specs/data/specGrammar.js","undoManager":{"mark":100,"position":100,"stack":[[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":878,"column":60},"end":{"row":878,"column":61}},"text":"b"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":878,"column":61},"end":{"row":878,"column":62}},"text":"l"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":878,"column":62},"end":{"row":878,"column":63}},"text":"e"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":878,"column":64},"end":{"row":878,"column":65}},"text":","}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":878,"column":65},"end":{"row":878,"column":66}},"text":" "}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":878,"column":66},"end":{"row":878,"column":67}},"text":"f"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":878,"column":67},"end":{"row":878,"column":68}},"text":"u"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":878,"column":68},"end":{"row":878,"column":69}},"text":"n"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":878,"column":69},"end":{"row":878,"column":70}},"text":"c"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":878,"column":70},"end":{"row":878,"column":71}},"text":"t"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":878,"column":71},"end":{"row":878,"column":72}},"text":"i"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":878,"column":72},"end":{"row":878,"column":73}},"text":"o"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":878,"column":73},"end":{"row":878,"column":74}},"text":"n"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":878,"column":74},"end":{"row":878,"column":75}},"text":" "}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":878,"column":75},"end":{"row":878,"column":77}},"text":"()"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":878,"column":77},"end":{"row":879,"column":0}},"text":"\n"},{"action":"insertText","range":{"start":{"row":879,"column":0},"end":{"row":879,"column":4}},"text":"\t\t\t\t"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":879,"column":4},"end":{"row":879,"column":6}},"text":"{}"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":879,"column":5},"end":{"row":880,"column":0}},"text":"\n"},{"action":"insertLines","range":{"start":{"row":880,"column":0},"end":{"row":881,"column":0}},"lines":["\t\t\t\t\t"]},{"action":"insertText","range":{"start":{"row":881,"column":0},"end":{"row":881,"column":4}},"text":"\t\t\t\t"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":881,"column":6},"end":{"row":881,"column":7}},"text":";"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":880,"column":4},"end":{"row":880,"column":5}},"text":"\t"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":880,"column":5},"end":{"row":880,"column":31}},"text":"var Sa = new k.data.Rule({"},{"action":"insertText","range":{"start":{"row":880,"column":31},"end":{"row":881,"column":0}},"text":"\n"},{"action":"insertLines","range":{"start":{"row":881,"column":0},"end":{"row":900,"column":0}},"lines":["\t\t\t\t\t\t\thead: 'Sa'","\t\t\t\t\t\t}),","\t\t\t\t\t\tSa2 = new k.data.Rule({","\t\t\t\t\t\t\thead: 'Sa',","\t\t\t\t\t\t\ttail: k.data.NonTerminal.fromArray(['B'])","\t\t\t\t\t\t}),","\t\t\t\t\t\tA = new k.data.Rule({","\t\t\t\t\t\t\thead: 'A',","\t\t\t\t\t\t\ttail: [new k.data.Terminal({name:'aa_terminal', body: 'aa'}), new k.data.Symbol({name: k.data.specialSymbol.EMPTY}), new k.data.Symbol({name: k.data.specialSymbol.EMPTY})]","\t\t\t\t\t\t}),","\t\t\t\t\t\tB = new k.data.Rule({","\t\t\t\t\t\t\thead: 'B',","\t\t\t\t\t\t\ttail: [new k.data.Symbol({name: k.data.specialSymbol.EMPTY})]","\t\t\t\t\t\t}),","\t\t\t\t\t\tg1 =new k.data.Grammar({","\t\t\t\t\t\t\tstartSymbol: Sa.head,","\t\t\t\t\t\t\trules: [Sa, Sa2, A, B]","\t\t\t\t\t\t});","\t\t\t\t\t"]},{"action":"insertText","range":{"start":{"row":900,"column":0},"end":{"row":900,"column":37}},"text":"\t\t\t\t\texpect(g1.rules.length).toBe(4);"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":874,"column":42},"end":{"row":875,"column":0}},"text":"\n"},{"action":"insertText","range":{"start":{"row":875,"column":0},"end":{"row":875,"column":5}},"text":"\t\t\t\t\t"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":875,"column":5},"end":{"row":875,"column":42}},"text":"expect(A.head.isNullable).toBe(true);"}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":875,"column":12},"end":{"row":875,"column":13}},"text":"A"},{"action":"insertText","range":{"start":{"row":875,"column":12},"end":{"row":875,"column":13}},"text":"S"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":875,"column":13},"end":{"row":875,"column":14}},"text":"a"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":875,"column":43},"end":{"row":876,"column":0}},"text":"\n"},{"action":"insertText","range":{"start":{"row":876,"column":0},"end":{"row":876,"column":5}},"text":"\t\t\t\t\t"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":876,"column":5},"end":{"row":876,"column":43}},"text":"expect(Sa.head.isNullable).toBe(true);"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":876,"column":14},"end":{"row":876,"column":15}},"text":"2"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":880,"column":4},"end":{"row":880,"column":5}},"text":"x"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":874,"column":5},"end":{"row":874,"column":8}},"text":"// "}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":876,"column":5},"end":{"row":876,"column":8}},"text":"// "}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":853,"column":5},"end":{"row":854,"column":0}},"text":"\n"},{"action":"insertText","range":{"start":{"row":854,"column":0},"end":{"row":854,"column":5}},"text":"\t\t\t\t\t"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":854,"column":5},"end":{"row":854,"column":6}},"text":"d"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":854,"column":6},"end":{"row":854,"column":7}},"text":"e"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":854,"column":7},"end":{"row":854,"column":8}},"text":"b"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":854,"column":8},"end":{"row":854,"column":9}},"text":"u"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":854,"column":9},"end":{"row":854,"column":10}},"text":"g"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":854,"column":10},"end":{"row":854,"column":11}},"text":"g"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":854,"column":11},"end":{"row":854,"column":12}},"text":"e"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":854,"column":12},"end":{"row":854,"column":13}},"text":"r"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":854,"column":13},"end":{"row":854,"column":14}},"text":";"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":888,"column":46},"end":{"row":888,"column":47}},"text":","}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":888,"column":47},"end":{"row":888,"column":48}},"text":" "}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":888,"column":48},"end":{"row":888,"column":50}},"text":"''"}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":888,"column":49},"end":{"row":888,"column":50}},"text":"'"}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":888,"column":48},"end":{"row":888,"column":49}},"text":"'"}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":888,"column":47},"end":{"row":888,"column":48}},"text":" "}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":888,"column":46},"end":{"row":888,"column":47}},"text":","}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":877,"column":5},"end":{"row":877,"column":8}},"text":"// "}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":860,"column":46},"end":{"row":860,"column":47}},"text":","}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":860,"column":47},"end":{"row":860,"column":48}},"text":" "}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":860,"column":48},"end":{"row":860,"column":50}},"text":"''"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":860,"column":49},"end":{"row":860,"column":50}},"text":"C"}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":869,"column":8},"end":{"row":869,"column":9}},"text":","}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":869,"column":8},"end":{"row":869,"column":9}},"text":","},{"action":"insertText","range":{"start":{"row":869,"column":9},"end":{"row":870,"column":0}},"text":"\n"},{"action":"insertLines","range":{"start":{"row":870,"column":0},"end":{"row":873,"column":0}},"lines":["\t\t\t\t\t\tB = new k.data.Rule({","\t\t\t\t\t\t\thead: 'B',","\t\t\t\t\t\t\ttail: [new k.data.Symbol({name: k.data.specialSymbol.EMPTY})]"]},{"action":"insertText","range":{"start":{"row":873,"column":0},"end":{"row":873,"column":9}},"text":"\t\t\t\t\t\t}),"}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":870,"column":6},"end":{"row":870,"column":7}},"text":"B"},{"action":"insertText","range":{"start":{"row":870,"column":6},"end":{"row":870,"column":7}},"text":"C"}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":871,"column":14},"end":{"row":871,"column":15}},"text":"B"},{"action":"insertText","range":{"start":{"row":871,"column":14},"end":{"row":871,"column":15}},"text":"C"}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":872,"column":14},"end":{"row":872,"column":66}},"text":"new k.data.Symbol({name: k.data.specialSymbol.EMPTY}"}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":872,"column":14},"end":{"row":872,"column":15}},"text":")"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":872,"column":14},"end":{"row":872,"column":67}},"text":"new k.data.Terminal({name:'aa_terminal', body: 'aa'})"}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":872,"column":62},"end":{"row":872,"column":63}},"text":"a"}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":872,"column":62},"end":{"row":872,"column":63}},"text":"a"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":872,"column":62},"end":{"row":872,"column":63}},"text":"c"}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":872,"column":42},"end":{"row":872,"column":43}},"text":"a"}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":872,"column":41},"end":{"row":872,"column":42}},"text":"a"}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":872,"column":40},"end":{"row":872,"column":41}},"text":"'"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":872,"column":40},"end":{"row":872,"column":41}},"text":"'"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":872,"column":41},"end":{"row":872,"column":42}},"text":"c"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":860,"column":51},"end":{"row":860,"column":52}},"text":","}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":860,"column":52},"end":{"row":860,"column":53}},"text":" "}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":860,"column":53},"end":{"row":860,"column":55}},"text":"''"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":860,"column":54},"end":{"row":860,"column":55}},"text":"A"}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":879,"column":5},"end":{"row":879,"column":8}},"text":"// "}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":879,"column":42},"end":{"row":880,"column":0}},"text":"\n"},{"action":"insertText","range":{"start":{"row":880,"column":0},"end":{"row":880,"column":5}},"text":"\t\t\t\t\t"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":883,"column":5},"end":{"row":884,"column":0}},"text":"\n"},{"action":"insertText","range":{"start":{"row":884,"column":0},"end":{"row":884,"column":5}},"text":"\t\t\t\t\t"}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":855,"column":0},"end":{"row":855,"column":5}},"text":"\t\t\t\t\t"},{"action":"removeText","range":{"start":{"row":854,"column":5},"end":{"row":854,"column":14}},"text":"debugger;"},{"action":"removeText","range":{"start":{"row":854,"column":5},"end":{"row":855,"column":0}},"text":"\n"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":853,"column":5},"end":{"row":854,"column":0}},"text":"\n"},{"action":"insertText","range":{"start":{"row":854,"column":0},"end":{"row":854,"column":5}},"text":"\t\t\t\t\t"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":854,"column":5},"end":{"row":854,"column":6}},"text":"d"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":854,"column":6},"end":{"row":854,"column":7}},"text":"e"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":854,"column":7},"end":{"row":854,"column":8}},"text":"b"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":854,"column":8},"end":{"row":854,"column":9}},"text":"u"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":854,"column":9},"end":{"row":854,"column":10}},"text":"g"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":854,"column":10},"end":{"row":854,"column":11}},"text":"g"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":854,"column":11},"end":{"row":854,"column":12}},"text":"e"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":854,"column":12},"end":{"row":854,"column":13}},"text":"r"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":854,"column":13},"end":{"row":854,"column":14}},"text":";"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":876,"column":28},"end":{"row":876,"column":29}},"text":","}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":876,"column":29},"end":{"row":876,"column":30}},"text":" "}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":876,"column":30},"end":{"row":876,"column":31}},"text":"C"}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":854,"column":0},"end":{"row":854,"column":14}},"text":"\t\t\t\t\tdebugger;"},{"action":"removeText","range":{"start":{"row":853,"column":5},"end":{"row":854,"column":0}},"text":"\n"}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":886,"column":4},"end":{"row":886,"column":5}},"text":"x"}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":908,"column":37},"end":{"row":908,"column":38}},"text":"\t"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":908,"column":37},"end":{"row":909,"column":0}},"text":"\n"},{"action":"insertText","range":{"start":{"row":909,"column":0},"end":{"row":909,"column":5}},"text":"\t\t\t\t\t"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":909,"column":5},"end":{"row":909,"column":42}},"text":"expect(A.head.isNullable).toBe(true);"}]}],[{"group":"doc","deltas":[{"action":"insertLines","range":{"start":{"row":910,"column":0},"end":{"row":911,"column":0}},"lines":["\t\t\t\t\texpect(A.head.isNullable).toBe(true);"]}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":909,"column":36},"end":{"row":909,"column":40}},"text":"true"},{"action":"insertText","range":{"start":{"row":909,"column":36},"end":{"row":909,"column":37}},"text":"f"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":909,"column":37},"end":{"row":909,"column":38}},"text":"a"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":909,"column":38},"end":{"row":909,"column":39}},"text":"l"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":909,"column":39},"end":{"row":909,"column":40}},"text":"s"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":909,"column":40},"end":{"row":909,"column":41}},"text":"e"}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":910,"column":12},"end":{"row":910,"column":13}},"text":"A"},{"action":"insertText","range":{"start":{"row":910,"column":12},"end":{"row":910,"column":13}},"text":"B"}]}]]},"ace":{"folds":[{"start":{"row":6,"column":2},"end":{"row":95,"column":1},"placeholder":"..."},{"start":{"row":98,"column":2},"end":{"row":185,"column":1},"placeholder":"..."},{"start":{"row":188,"column":2},"end":{"row":318,"column":1},"placeholder":"..."},{"start":{"row":321,"column":2},"end":{"row":461,"column":1},"placeholder":"..."},{"start":{"row":464,"column":2},"end":{"row":937,"column":1},"placeholder":"..."}],"scrolltop":0,"scrollleft":0,"selection":{"start":{"row":0,"column":0},"end":{"row":0,"column":0},"isBackwards":true},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":{"row":471,"state":"start","mode":"ace/mode/javascript"}},"timestamp":1405131751643,"hash":"d956c2ff30fcfd7f1df5990857157145a61181f0"}