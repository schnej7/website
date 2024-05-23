const KEY_STR = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

const atob = (input: string) => {
    let output = "";
    let chr1, chr2, chr3;
    let enc1, enc2, enc3, enc4;
    let i = 0;

    do {
        enc1 = KEY_STR.indexOf(input.charAt(i++));
        enc2 = KEY_STR.indexOf(input.charAt(i++));
        enc3 = KEY_STR.indexOf(input.charAt(i++));
        enc4 = KEY_STR.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }

        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";

    } while (i < input.length);

    return output;
}

const RomStrings = {
    'INVADERS': 'EiVTUEFDRSBJTlZBREVSUyB2MC45IEJ5IERhdmlkIFdJTlRFUmAAYQBiCKPT0BhxCPIeMSASLXAIYQAwQBItaQVsFW4AI4dgCvAV8AcwABJLI4d+ARJFZgBoHGkAagRrCmwEbTxuDwDgI2sjR/0VYATgnhJ9I2s4AHj/I2tgBuCeEosjazg5eAEjazYAEp9gBeCeEulmAWUbhICjz9RRo8/UUXX/Nf8SrWYAEunUUT8BEunUUWYAg0BzA4O1YviDImIIMwASySNzggZDCBLTMxAS1SNzggYzGBLdI3OCBkMgEuczKBLpI3M+ABMHeQZJGGkAagRrCmwEffRuDwDgI0cja/0VEm/3BzcAEm/9FSNHi6Q7EhMbfAJq/DsCEyN8AmoEI0c8GBJvAOCk02AUYQhiD9AfcAjyHjAsEzPwCgDgpvT+ZRIlo7f5HmEII1+BBiNfgQYjX4EGI1970ADugOCAEjAA28Z7DADuo89gHNgEAO4jR44jI0dgBfAY8BXwBzAAE38A7moAjeBrBOmhElemAv0e8GUw/xOlagBrBG0BbgETjaUA8B7bxnsIfQF6AToHE40A7jx+//+ZmX7//yQk537/PDx+24FCPH7/2xA4fP4AAH8APwB/AAAAAQEBAwMDAwAAPyAgICAgICAgPwgI/wAA/gD8AP4AAAB+QkJiYmJiAAD/AAAAAAAAAAD/AAD/AH0AQX0FfX0AAMLCxkRsKDgAAP8AAAAAAAAAAP8AAP8A9xAU9/cEBAAAfET+wsLCwgAA/wAAAAAAAAAA/wAA/wDvICjo6C8vAAD5hcXFxcX5AAD/AAAAAAAAAAD/AAD/AL4AIDAgvr4AAPcE54WFhPQAAP8AAAAAAAAAAP8AAP8AAH8APwB/AAAA7yjvAOBgbwAA/wAAAAAAAAAA/wAA/wAA/gD8AP4AAADAAMDAwMDAAAD8BAQEBAQEBAT8EBD/+YG5i5qa+gD6ipqam5n45iUl9DQ0NAAXFDQ3NibH31BQXNjY3wDfER8SGxnZfET+hoaG/IT+goL+/oDAwMD+/ILCwsL8/oD4wMD+/oDwwMDA/oC+hob+hob+hoaGEBAQEBAQGBgYSEh4nJCwwLCcgIDAwMD+7pKShoaG/oKGhoaGfIKGhoZ8/oL+wMDAfILCysR6/ob+kJyE/sD+AgL+/hAwMDAwgoLCwsL+goKC7jgQhoaWkpLugkQ4OESCgoL+MDAw/gIe8ID+AAAAAAYGAAAAYGDAAAAAAAAAGBgYGAAYfMYMGAAYAAD+/gAA/oKGhob+CAgIGBgY/gL+wMD+/gIeBgb+hMTE/gQE/oD+Bgb+wMDA/oL+/gICBgYGfET+hob+/oL+BgYGRP5ERP5EqKioqKioqGxaAAwYqDBOfgASGGZsqFpmVCRmAEhIGBKoBpCoEgB+MBKohDBOchhmqKioqKiokFR4qEh4bHKoEhhscmZUkKhyKhioME5+ABIYZmyoclSoWmYYfhhOcqhyKhgwZqgwTn4AbDBUTpyoqKioqKioSFR+GKiQVHhmqGwqMFqohDByKqjYqABOEqjkoqgAThKobCpUVHKohDByKqjenKhyKhioDFRIWnhyGGaochhCQmyocioAcqhyKhioME5+ABIYZmyoME4MZhgAbBiocioYMGaoHlRmDBicqCRUVBKoQngMPKiuqKioqKioqP8AAAAAAAAAAAAAAAAAAAA=',
    '15PUZZLE': 'AOBsAEwAbg+iA2Ag8FUA4CK+InYijiJeIkYSEGEAYhdjBEEQAO6i6PEe8GVAABI08CnSNXEBcgVkA4QSNAASImIXcwYSImQDhOJlA4XSlFAA7kQDAO5kAYTkIqYSRmQDhOJlA4XSlFAA7kQAAO5k/4TkIqYSXmQMhOJlDIXSlFAA7kQAAO5k/ITkIqYSdmQMhOJlDIXSlFAA7kQMAO5kBITkIqYSjqLo9B7wZaLo/h7wVWAAouj0HvBVjkAA7jwAEtIiHCLYIhyi+P0e8GWNAADufP/NDwDufQFgD40C7Z4S2O2hEuIA7gECAwQFBgcICQoLDA0ODwANAAECBAUGCAkKDA4DBwsPhOQiphJ2ZAyE4mUMhdKUUADuRAwA7mQEhOQiphKOouj0HvBlouj+HvBVYACi6PQe8FWOQADuPAAS0iIcItgiHKL4/R7wZY0AAO58/80PAO59AWAPjQLtnhLY7aES4gDuAQIDBAUGBwgJCgsMDQ4PAA0AAQIEBQYI',
    'BLINKY': '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AMAAAACAgAAAwICAgMAAgAAMCAgICAgICAgICAgICAgNDAgICAgICAgICAgICAgIDQplBQUFBeUFBeUFBQUFxQoKZQUFBQXlBQXlBQUFBcUKCgUMCAgPBQwNBQgICA0FDg8FDAgIDwUMDQUICAgNBQoKBQplBgWVCgo1BQXFCjUFBZUKZQUFlQoKNQUGxQoFCgoFDwUICAgICAwIDwUICAgICA8FCAgMCAgICA8FDwUKCnUFtQUFBQXFCmUFtQXlBQXlBbUFxQplBQUFBbUF1QoKBQwICAgIDQUPBQwIDwUIDwUICA0FDwUMCAgICA0FCg8FD2UFBcUKNeWVCmUFsAUFtQXFCjXllQplBQXFDwUPB3QF1QgPBQ4PBQgPBQwICAgIDQUIDwUIDwUID3UF1AcKBQo1BQX1BQW1BQXVCAgNDAgPdQUFtQUF9QUFlQoFCgoFCAgIDQUMCAgIDTUFxQoKZQWVDAgICA0FDAgIDwUKCnUFBsUKBQgICAgICA8FCA8FCAgICAgIDwUKZQYF1QoKBQwNBQo1BQUFBeUFBfUFBfUFBeUFBQUFlQoFDA0FCgoFCA8FCAgICAgPBQwNBQgPBQwNBQgICAgIDwUIDwUKCjUFBbUFBQUFBQWVCgo1BQWVCgo1BQUFBQUFtQUFlQoICAgICAgICAgICAgPCAgICAgPCAgICAgICAgICAgIDzxCmZlCPAEQD3iEMjKEeAAQ4Hj8/v6EeAAQ4A==',
    'BLITZ': 'EhdCTElUWiBCeSBEYXZpZCBXSU5URVKjQWAEYQliDmcE0B7yHnAMMEASIfAKAOAi2fAKAOCOcKMeax/MH4zE3LI/ARJJ3LISOcoHegF7/tyyev86ABJNfv8+ABI5awCMcG0AbgCjG93jPwASwTsAEoFgBeCeEodrAYjQeAKJ4HkDox7YkYHwYAXwFfAHMAASizsBEqujHjEB2JF5ATkgEqtrADEAfP9MABK7oxvd430CPUASuW0AfgESZQDgdwISLaMb3eNgFGECYgujINAb8h5wCDAsEs0S12AKYQ1iBaMH0BXyHnAIMCoS4YBwcP6ABqOH8DPyZWAt8SlhDdAVcAXyKdAVAO6DgoOC++gIiAXivqC4ID6AgICA+ID4/MDA+YHby/sA+oqamfjvKugpKQBvaC5Mj76guLC+AL4iPjSy2NgAw8MA2NgAw8MA2NjAwADAwADAwADAwADb29vbABgYABgYABgYANvb29sAGBgAGBgAGBgAGBjb2wADAwAYGADAwADb2w==',
    'BRIX': 'bgVlAGsGagCjDNqxegQ6QBIIewI7EhIGbCBtH6MQ3NEi9mAAYQCjEtARcAijDtARYEDwFfAHMAASNMYPZx5oAWn/ow7WcaMQ3NFgBOChfP5gBuChfAJgP4wC3NGjDtZxhoSHlGA/hgJhH4cSRx8SrEYAaAFGP2j/RwBpAdZxPwESqkcfEqpgBYB1PwASqmAB8BiAYGH8gBKjDNBxYP6JAyL2dQEi9kVgEt4SRmn/gGCAxT8BEsphAoAVPwES4IAVPwES7oAVPwES6GAg8BijDn7/gOCABGEA0BE+ABIwEt54/0j+aP8S7ngBSAJoAWAE8Bhp/xJwoxT1M/Jl8SljN2QA00VzBfIp00UA7uAAgAD8AKoAAAAAAA==',
    'CONNECT4': 'EhpDT05ORUNUNCBieSBEYXZpZCBXSU5URVKiu/ZlorT2VWkAaAFrAG0Pbh+ipWANYTJiANAv0S9yDzIeEjTQIdEhcgFgCqKf0CHRIaKf3eH8Ct3hTAUSfjwEEmp7/337PQoSemsGbS0SejwGEph7AX0FPTISemsAbQ/d4RJQorT7HvBlQPwSmIoAcPvwVYmDop45AKKh3aSin93hElBg8PBgkJBggICAgICAgICAgICAgICAGhoaGhoaGhoaGhoaGho=',
    'GUESS': 'bgEA4G0BagFrAYzQjOJMABIgiNAiPjpAEiBqAXsGPD99AT0/EgrwCkAFieSO5D5AEgJqHGsNiJAA4CI+EjyilPgz8mUiVNq1egSBICJU2rV6BQDugxCDNIM0gxSiYvMeAO7goKCg4EBAQEBA4CDggODgIOAg4KCg4CAg4IDgIODggOCg4OAgICAg4KDgoODgoOAg4A==',
    'HIDDEN': 'Eh1ISURERU4hIDEuMCBCeSBEYXZpZCBXSU5URVKkP2AAYUDxVaQ/YADwVQDgpH5gDGEIYg/QH3AI8h4wNBI18AoA4KTJYBNhDWIE0BRwCPIeMCsSS6Qf/2WkL/9VY0BmCMEPwg+kL/Ee8GWEAKQv8h7wZYUAgEDwVaQv8R6AUPBVc/8zABJhAOBgAGEApHfQF3AIMCASj2AAcQgxIBKPbABtAG4ApD/wZXAB8FUjuWoQI10jzYqQh9CI4CNdI80juaQv+R7wZYEApC/6HvBlUBATKyPfYCAkASPfYACkL/ke8FWkL/oe8FV2/zYAEqWkP/FlggCAFT8AEwGAIIEg8VUA4KUZYBBhB2IO0B9wCPIeMDATC6Q/8WWEEIMAZgkkC2YPg0AkC/AKEiUj22CAJAEj26Qv+h7wZXD/I/OkQfAe14ekd9eHpC/5HvBlcP8j86RB8B7d56R33ecSpaRx3ef7Ct3nOwQTcU0AE119+Hz/OwYTfU0YE119CHwBOwITiU4AE11++Hz8OwgTlU4YE11+CHwEOwUTXaQv/B7wZUAAE12JwJmgE11w/6R33eekQSPz8B7d5wDupNVgJGEKYgvQG3AI8h4wPBPBAO5gNGEQpPHQFaT20BUA7qT7E+GlCmAkYQ1iBdAVcAjyHjA8E+cA7oEAgRSABIAEgASAFQDu8BXwBzAAFAMA7qQv8zPyZWUj8SnVZWUo8inVZQDuAQIDBAgHBgUFBgcIBAMCAQECAwQIBwYFBQYHCAQDAgEAAP7uxoLG7v7+xsbG/v7GqoKqxv7GgoKCxv661u7Wuv7u7oLu7v6C/oL+gv6qqqqqqv7+/v7+/v6q1qrWqv6LiPiIiwAAAAAA8EhISPLvhISE7wAICAoAioqqqlI8kpKSPADio+MAi8iomIj6g+KC+gAouJAA74iOiI8hIaFgIQAAAAAAvCI8KKSJiqtSl1HRUcAAABVqio6KagBkio6KakSqqqpEAMyqyqqsbohMKM4ABAwEBA4MEgQIHmOUlJRjOKW4oCHhAcEgwYmKUiIhzygvKMgCggIAAv+Aj5COgZ6AkZGfkZGA/wA8QEBAPAB8EBAQfAD/AACAAIAAAACAAIAAAP8BAQEBAQEBAQEBAQEB/w==',
    'KALEID': 'YABjgGEfYg8iMqIA8x7wCvBVQAASHHMBMwASCGOAogDzHvBlQAASHHMBQwASHCIyEh5AAnL/QARx/0AGcQFACHIBondq4IoSax+BsjoAcgFq8Ioiaw+CsjoAcQFrH4Gy0SGKEGsfiyXasWo/ihXasYsg2rEA7gGA',
    'MAZE': 'oh7CATIBohrQFHAEMEASAGAAcQQxIBIAEhiAQCAQIECAEA==',
    'MERLIN': 'EhkgTUVSTElOIEJ5IERhdmlkIFdJTlRFUiL5ox1gEGEAIsujMWALYRsiy2QEIt9lAGIoIsHCA4Ago1n1HvBVYBdhCGMBgyIzAHAKYwKDIjMAcQqjF9AWYhQiwdAWYgUiwXUBVFASNWUAYBdhCKMX8wozBBJ5YwASlzMFEoNwCmMBEpczBxKNcQpjAhKXMwgSaXAKcQpjA9AWYhQiwdAWo1n1HvBldQFQMBK1VUASaSLfdAESLSL5o0VgEGEOIssSv/IV8gcyABLDAO6DAGIF0BXyHnAIhTB1IFBQEs8A7qNZg0Bz/fMz8mXxKWArYxvQNXAF8inQNQDuow9gF2EH0BhwCtAYcQrQGHD20BgA7v+BgYGBgYH/fn5+fn5+26qLy8vvCI8N7KCgsDC+X1FR2dmDgoOC++gIiAXivqC4ID6AgICA+PeFt5X1dlRWVFY6KioqObaltqU1',
    'MISSILE': 'EhlNSVNTSUxFIGJ5IERhdmlkIFdJTlRFUmwMYABhAGUIZgpnAG4Boq3QFHAIMEASKWAAYRyisNAUorDQFD4BEklwBEA4bgAST3D8QABuAdAU/BX7BzsAElNiCOKeEpU8AHz+YxuCAKKw0jFkANIxc//SMT8AZAEzAxJt0jE0ARKRdwV1/4IAYwCirdI0RQASl3b/NgASOaK09zPyZWMbZA3xKdNFcwXyKdNFEqsQODgQOHz+',
    'PONG': 'agJrDGw/bQyi6tq23NZuACLUZgNoAmBg8BXwBzAAEhrHF3cIaf+i8NZxourattzWYAHgoXv+YATgoXsCYB+LAtq2YAzgoX3+YA3goX0CYB+NAtzWovDWcYaEh5RgP4YCYR+HEkYCEnhGPxKCRx9p/0cAaQHWcRIqaAJjAYBwgLUSimj+YwqAcIDVPwESomECgBU/ARK6gBU/ARLIgBU/ARLCYCDwGCLUjjQi1GY+MwFmA2j+MwFoAhIWef9J/mn/Esh5AUkCaQFgBPAYdgFGQHb+Emyi8v4z8mXxKWQUZQDUVXQV8inUVQDugICAgICAgAAAAAAA',
    'PONG2': 'IvZrDGw/bQyi6tq23NZuACLUZgNoAmBg8BXwBzAAEhrHF3cIaf+i8NZxourattzWYAHgoXv+YATgoXsCYB+LAtq2YAzgoX3+YA3goX0CYB+NAtzWovDWcYaEh5RgP4YCYR+HEkYAEnhGPxKCRx9p/0cAaQHWcRIqaAJjAYBwgLUSimj+YwqAcIDVPwESomECgBU/ARK6gBU/ARLIgBU/ARLCYCDwGCLUjjQi1GY+MwFmA2j+MwFoAhIWef9J/mn/Esh5AUkCaQFgBPAYdgFGQHb+Emyi8v4z8mXxKWQUZQDUVXQV8inUVQDugICAgICAgAAAAAAAayBsAKLq28F8ATwgEvxqAADu',
    'PUZZLE': 'ahJrAWEQYgBgAKKw0SfwKTAA2rVxCHoIMTASJGEQcghqEnsIowDwHvBVcAEwEBIKahJrAWwAYv/ABnACIlJy/zIAEjhuAG4A8AoiUn4BfgESSISghbCGwDACEmRFARJkdfh2/DAIEnBFGRJwdQh2BDAGEnxEEhJ8dPh2/zAEEohEKhKIdAh2AaMA9h7wZYEAYACjAPYe8FWjAPwegBDwVfEp1FXatYpAi1CMYADu7l7+/v7+/v7+/g==',
    'SYZYGY': 'EhKNjSCpMTk5MCBSVFQgjo4AJLYk2mAP4KESJGAO4KESKBIWJNoSLADgEizBH3EQwg9yCMMDhTCGEIcgiDBIAHcBSAF3/0gCdgFIA3b/pUzRIdZxZPBp8agA9B6AMPBVdAGoAPQeYAHwVSUiagB6APAHMAASnD0AEpRgAPAp28U/ARKM28UlIvAVEpz+FW0BbgASnIDg8CnbxSUiYAPgoWMAYAbgoWMBYAfgoWMCYAjgoWMDQwBy/0MBcgFDAnH/QwNxAaVM0SE/ARMkPQETiGA/gQJgH4ICgLCAFz8BE4iAsHADgBU/AROIgMCAJz8BE4iAwHAEgCU/AROIYATwGM4HfgKK5KVM0SFgAPAp28WA4PAp28VgMPAV8AcwABMapUzRIZNQEz50AagA9B6AMPBVdAGoAPQeYADwVYUwqAD0HvBlcAHwVUoAE1hgDHD/MAATTnr/EnClTNZxSAB3/0gBdwFIAnb/SAN2AagA+R7wZXD/8FUwABJweQGoAPke8GWIAHkBEnBgDfAYYAvgnhOOawFsAG0AewE7ChOqawB8ATwKE6psAH0BpUzWcUgAd/9IAXcBSAJ2/0gDdgGoAPke8GVw//BVMAATmJlAE955AagA+R7wZYgAeQETmADgZhFnCWgvaRelUtZ+2H53/6VO1nHWkXYI1nHWkXYI1nHWkXYIpVDWcdaRpZ5mE2cRJJqlrvNlk9AUJIAwgNU/ARQ6FESSwBQygCCAxT8BFDoURIAQgLU/ABREpa6D0ILAgbDzVaWu82VmE3f5jTCMIIsQpaQkmsE/wh9gDYAVPwAUfGAwgBc/ABR8YAOAJT8AFHxgGIAnPwAUfBSCww/zKdElYA/goRSQYA7goRSWFFYA4CS2EiwA4BIs1nWlqnYC1nT9KXYK1nX8KXYF1nX7KXYF1nUA7qVOYQBiAGYf0SHRYXEIMUAUvqVSYgFlP9Ev1S9yD9Ev1S8A7mEMYgelYtEqpWxxBtEqpXZxBtEqpWxxBtEqpYBxBtEqpWxxBtEqYQ5iGKWK0SOljnEIcv/RJHEJcv6lktEmcQZyAaWY0SUA7m3Fyz+OsI7UTwEVJHsBbebMH47AjtRPARUyfAFtAM4/fkD+Fc4/fkAA7oAA/wD+AICAgICAgICAgICAgICAgIAfEBAQHwEBAQEfERERER8EBAQEBB8BAgIEBAgIEB8fERAQEBMREREfBQUCAHFRUXUMEh4UEgkUPhUVKgB3RCQUdwBXUnJSVwAAAQABAAAAAA==',
    'TANK': 'EjB2+2AggGVPAGYAE4QA/wAAAAEADAoAGQIEBggCAgMsAA8AAgUuCAAAAgUAAAAAbgBtoGoIaQZoBGcCZhlkEGMMYgBhBqIS+lUj1GBA8BXwBzAAElAj1CMKI2KiEvVlIq4ixiLsPwEjFD8BIuw/ASLsPwEifE8BE2YSYqIS9WVGADUAEogTjOehYgnooWIE6aFiBuqhYgFCAADuIq6BICOaI6xsAWIAbwCiEvVVo/9BAWAAQQRgE0EGYA1BCWAG8B7TRwDuYAXgngDuRQ8A7mUPdv+iEvVVdANzAyOaI5ojmqIj9VWkGdNBAO6iI/VlRQAA7qQZ00EjmmwCI75LuxMK00GiI/VVAO5lAGAAohfwVRMEoh31ZTUPE0SkGtNFMgATMsEDohnxHvBlgQDCD3IBI5qkGmwDcv9vANNFoh31VQDuxAekH/Qe8GWDAKQn9B7wZYQApBrTRWAg8BhlDxM+ZQATPkwBEgJMAhOCoiP1ZUUAEgKkGdNBbwDTQT8BEgJ+CmBA8BgA4BJKAOAj1GBg8BgTlG4AE4RBAXT/QQRz/0EGcwFBCXQBAO5EAHQBQwBzAUM4c/9EGHT/AO5rAEQAE85DABPOQz8TzkQfa7tvAADuYwhkCKIp/jPyZSPsYyiiKfYz8mUj8gDu8CnTRXMG8SnTRXMG8inTRQDuARBUfGx8fER8fGx8VBAA/HhuePwAPx52Hj8AgKhw+HCoCxsoODAgEAAAAAAIGxsbGAQ=',
    'TETRIS': 'orQj5iK2cAHQETAlEgZx/9ARYBrQEWAlMQASDsRwRHASHMMDYB5hAyJc9RXQFD8BEjzQFHH/0BQjQBIc56EicuihIoTpoSKW4p4SUGYA9hX2BzYAEjzQFHEBEiqixPQeZgBDAWYEQwJmCEMDZgz2HgDu0BRw/yM0PwEA7tAUcAEjNADu0BRwASM0PwEA7tAUcP8jNADu0BRzAUMEYwAiXCM0PwEA7tAUc/9D/2MDIlwjNADugABnBWgGaQRhH2UQYgcA7kDgAABAwEAAAOBAAEBgQABAQGAAIOAAAMBAQAAA4IAAQEDAAADgIABgQEAAgOAAAEDAgADAYAAAQMCAAMBgAACAwEAAAGDAAIDAQAAAYMAAwMAAAMDAAADAwAAAwMAAAEBAQEAA8AAAQEBAQADwAADQFGY1dv82ABM4AO6itIwQPB58ATwefAE8HnwBI15LCiNykcAA7nEBE1BgG2sA0BE/AHsB0BFwATAlE2IA7mAb0BFwATAlE3SOEI3gfv9gG2sA0OE/ABOQ0OETlNDRewFwATAlE4ZLABOmff9+/z0BE4IjwD8BI8B6ASPAgKBtB4DSQAR1/kUCZQQA7qcA8lWoBPoz8mXwKW0ybgDd5X0F8Snd5X0F8ind5acA8mWitADuagBgGQDuNyM=',
    'TICTAC': 'EhhUSUNUQUMgYnkgRGF2aWQgV0lOVEVSawBsAICwgcCj5vFVo8T/ZaO0/1Wj5vFliwCMEADgbgFgE2EDo5rQEXAIMCsSPmATcQgxIxI+YBNhA6Ob0B9wCDAzElRgE3EP0BpwCDAzEmAjZvAKgQCjtPAe8GVAABKKInwSamAQ8BjwFfAHMAASggDuYAKOA4Dg8FWj1IAQcP+ABPAe8WWjqj4Do6/QFSLIOgASHKO0YQBiAGMB8GUwAHEB8x5yATIQErQxEBJqEhxqAKO0YAHwHvhlaQCJBCNEiRQjRIkkI0ppAIk0I0SJRCNEiVQjSmkAiWQjRIl0I0SJhCNKaQCJZCNEiTQjRIkEI0ppAIl0I0SJRCNEiRQjSmkAiYQjRIlUI0SJJCNKaQCJhCNEiUQjRIkEI0ppAIlkI0SJRCNEiSQjSgDuiQ6JDgDuSRUTVEk/E1oA7iNmewETXiNmfAEjZmoB8AoA7mMFZAqjr9NFYwJ0BqPm+zMjiGMyZAqjqtNFYy90BqPm/DPyZfApI5TxKSOU8inTRXMFAO5/gICAgICAgICAgICAgICAHCIiIhwiFAgUIgEAAAAAAAAAAAABAQEBAQEBAAAAAAAAAAAAAQEBAQEBEwUbBSMFEw0bDSMNExUbFSMV',
    'UFO': 'os1pOGoI2aOi0GsAbAPbw6LWZB1lH9RRZwBoDyKiIqxIABIiZB5lHKLT1FNuAGaAbQTtoWb/bQXtoWYAbQbtoWYBNoAi2KLQ28PNAYvU28M/ABKSos3Zo80BPQBt/3n+2aM/ABKMTgASLqLT1FNFABKGdf+EZNRTPwESRm0IjVJNCBKMEpIirHj/Eh4ioncFEpYioncPIqJtA/0YotPUUxKGovj3M2MAIrYA7qL4+DNjMiK2AO5tG/Jl8CnT1XMF8SnT1XMF8inT1QDuAXz+fGDwYEDgoPjUbgFtEP0YAO4=',
    'VBRIX': 'AOAjtmAH4J4SBGgAZwMjRiJKIsAjZiOKI6zwCiJaIloi0CKIOgASHGwBI6x3/yOsYHjwFfAHMAASNDcAEhwjrGAH4J4SQhIKAP1pEGAColTQlQDugICAgIAAYAHgoRJoYATgoRJyAO6AkHD/QAAA7hJ8gJBwAUAbAO4SfGEColTRldEFiQAA7oCgcP4wAADugLCAlU8AAO6BAGIFgSU/AADuorrwHvBljQBLAW0BSx5t/2wBYArwGADu//8AAQEAyyB7AWoEbAFtAaNk2rEA7oCggbCKxIvUo2RLAW0BSx5t/0o+bP9KAGwB0BHasU8AAO6AoGEhgBVPAADugKCBsHDecf9i/2P/ZANyAYBFPwATCnMBgUU/ABMSgCCBMIAkgCSBNIE0cCJxAaOG0BN+/2AAjAdgAvAYI4p4ASOKPgAA7iNmAO4A4GAAYQBiH6Nk0BHQIXABMD8TUNARcQExIBNaAO6AAGEBYwqjhmAiYgfQE3ADcv8yABNwcQNz/zMAE2xuRgDu4KDgAKOm+DPyZWMDZALwKdNFcwXxKdNFcwXyKdNFAO4AAAAAAABgFGEC9ynQFQDuYAphDGIJYwWjztAV8x5wBXL/MgATwADukJCQkGDgkOCQ4OCQ4JCQICAgICCQkGCQkAAAYAAA8JDwgIDwgPAQ8OCQ4JCQ',
    'VERS': 'EhpKTU4gMTk5MSBTT0ZUV0FSRVMggID/AABjAGcAAOCiF2AAYQDQEXH/0BFxAXAIMEASJnEBohXQEnD/0BJwAXECMR8SOGAIYRBiBGQ3ZQ9mAtAR1FFoAeihYgJoAuihYgRoB+ihYgFoCuihYgNoC+ihZgJoD+ihZgRoDOihZgFoDeihZgNCAXH/QgJw/0IDcQFCBHABRgF1/0YCdP9GA3UBRgR0AdARPwAStNRRPwASuBJWdwESunMBaAB4ATgAErwA4GAIYQTzKdAVYDT3KdAVaAB4ATgAEtRDCBLkRwgS5BIeEuQ=',
    'WIPEOFF': 'osxqB2EAawhgANARcAh7/zsAEgpxBHr/OgASBmYAZxCizWAgYR7QEWMdYj+CAnf/RwASqv8KosvSMWX/xAE0AWT/os1sAG4E7qFs/24G7qFsAdARgMTQEU8BEphCAGQBQj9k/0MAZQFDHxKkosvSMYJEg1TSMT8BEkJDHhKYagL6GHYBRnASqtIxxAE0AWT/xQE1AWX/EkJqA/oYosvSMXP/Ejaiy9IxEiiizdARovD2M/JlYxhkG/Ap00VzBfEp00VzBfIp00USyAGARP8=' };

const Roms: {[key: string]: string} = {}
for (let [key, value] of Object.entries(RomStrings)) {
  Roms[key] = atob(value);
}

export default Roms;