import axios from './request'

const StatConst = {
    TOTAL:0b000,
    ADULT: 0b001,
    GRADE: 0b010,
    LEAGUE: 0b100
}

// export class StatItem {
//     name: string
//     total: number
//     activist: number
//     admitted: number
//     constructor() {
//         this.name = "";
//         this.total = 0;
//         this.activist = 0;
//         this.admitted = 0;
//     }
// }

export interface StatResponse {
    "partyAdmittedStudents": number,
    "activistAdmittedStudents": number,
    "youthLeagueAdmittedStudents": number,
    "totalStudents": number
}

export function percentage(volumn: number, total: number) {
    return `${(volumn / total * 100).toFixed(2)}%`
}

export function getName(queryType: number): string {
    if (queryType < 8 && queryType > 0) {
        let typeName = "";
        if (queryType & StatConst.GRADE) typeName += "2024级";
        if (queryType & StatConst.ADULT) typeName += "成年";
        if (queryType & StatConst.LEAGUE) typeName += "团员";
        return typeName;
    }
    else if (queryType === StatConst.TOTAL) {
        return "全体"
    }
    return "";
}

export function queryStat(id: string, queryType: number, queryObject: string): Promise<StatResponse|null> {
    return new Promise((resolve,_)=>{
        axios.get(`/Util/${queryObject}/${id}`,{
            params:{queryType}
        }).then((res)=>{
            resolve(res.data);
        }).catch((e)=>{
            console.error(e);
            resolve(null);
        })
    })
}

export async function getClassBasicStat(id: string):Promise<Array<StatResponse|null>|null> {
    try {
        const queryResult = Array.from({length:8},()=>null) as Array<StatResponse | null>;
        let queryType = StatConst.TOTAL;
        queryResult[queryType] = await queryStat(id, queryType, "class");
        queryType = StatConst.ADULT;
        queryResult[queryType] = await queryStat(id, queryType, "class");
        queryType = StatConst.GRADE;
        queryResult[queryType] = await queryStat(id, queryType, "class");
        queryType = StatConst.LEAGUE;
        queryResult[queryType] = await queryStat(id, queryType, "class");
        queryType = StatConst.GRADE | StatConst.ADULT;
        queryResult[queryType] = await queryStat(id, queryType, "class");
        queryType = StatConst.GRADE | StatConst.LEAGUE;
        queryResult[queryType] = await queryStat(id, queryType, "class");
        queryType = StatConst.GRADE | StatConst.ADULT | StatConst.LEAGUE;
        queryResult[queryType] = await queryStat(id, queryType, "class");
        return queryResult;
    } catch (e) {
        console.error(e)
        return null;
    }
}