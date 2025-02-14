import { Injectable } from '@angular/core'
import { Country, Region, SmallCountry } from '../interfaces/country.interfaces'
import { HttpClient } from '@angular/common/http'
import { Observable, of, tap, map, combineLatest } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class CountriesService {
    private _baseUrl: string = 'https://restcountries.com/v3.1'
    private _regions: Region[] = [
        Region.Africa,
        Region.Americas,
        Region.Asia,
        Region.Europe,
        Region.Oceania,
    ]
    constructor(private _http: HttpClient) {}

    get regions(): Region[] {
        return [...this._regions]
    }

    getCountriesByRegion(region: Region): Observable<SmallCountry[]> {
        if (!region) return of([])
        const url: string = `${this._baseUrl}/region/${region}?fields=cca3,name,borders`

        return this._http.get<Country[]>(url).pipe(
            map((countries) =>
                countries.map((country) => ({
                    name: country.name.common,
                    cca3: country.cca3,
                    borders: country.borders ?? [],
                }))
            )
        )
    }

    getCountryByAlphaCode(alphaCode: string): Observable<SmallCountry> {
        const url = `${this._baseUrl}/alpha/${alphaCode}?fields=cca3,name,borders`

        return this._http.get<Country>(url).pipe(
            map((country) => ({
                name: country.name.common,
                cca3: country.cca3,
                borders: country.borders ?? [],
            }))
        )
    }

    getCountryBordersByCodes(borders: string[]): Observable<SmallCountry[]> {
        if (!borders || borders.length === 0) return of([])

        const countryRequests: Observable<SmallCountry>[] = []

        borders.forEach((code) => {
            const request = this.getCountryByAlphaCode(code)
            countryRequests.push(request)
        })

        return combineLatest(countryRequests)
    }
}
