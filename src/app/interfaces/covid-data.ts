export interface CovidData {
    date: number,
    state: string,
    positive?: number,
    probableCases?: number,
    negative?: number
}

export interface TwitterData {
    key: string,
    value?:number
}

export interface TwitterData {
    key: string,
    value?:number
}

export interface PieChartData {
    modelPosCount: number,
    totalTweetCount: number,
    totalLabelledCount: number
}