namespace WeAre.ReApptor.Toolkit.Validators.IBAN
{
    public enum IBANCountry
    {
        //List of the European IBAN countries:

        /// <summary>
        /// Finland - FI
        /// </summary>
        [IBAN("FI", 18)]
        Finland,

        /// <summary>
        /// Sweden - SE
        /// </summary>
        [IBAN("SE", 24)]
        Sweden,

        /// <summary>
        /// United Kingdom - GB
        /// </summary>
        [IBAN("GB", 22)]
        UnitedKingdom,

        /// <summary>
        /// Belgium - BE
        /// </summary>
        [IBAN("BE", 16)]
        Belgium,

        /// <summary>
        /// Albania - AL
        /// </summary>
        [IBAN("AL", 28)]
        Albania,

        /// <summary>
        /// Andorra - AD
        /// </summary>
        [IBAN("AD", 24)]
        Andorra,

        /// <summary>
        /// Austria - AT
        /// </summary>
        [IBAN("AT", 20)]
        Austria,

        /// <summary>
        /// Bosnia and Herzegovina - BA
        /// </summary>
        [IBAN("BA", 20)]
        BosniaAndHerzegovina,

        /// <summary>
        /// Bulgaria - BG
        /// </summary>
        [IBAN("BG", 22)]
        Bulgaria,

        /// <summary>
        /// Croatia - HR
        /// </summary>
        [IBAN("HR", 21)]
        Croatia,

        /// <summary>
        /// Cyprus - CY
        /// </summary>
        [IBAN("CY", 28)]
        Cyprus,

        /// <summary>
        /// Czech Republic - CZ
        /// </summary>
        [IBAN("CZ", 24)]
        CzechRepublic,

        /// <summary>
        /// Denmark - DK
        /// </summary>
        [IBAN("DK", 18)]
        Denmark,

        /// <summary>
        /// Estonia - EE
        /// </summary>
        [IBAN("EE", 20)]
        Estonia,

        /// <summary>
        /// Faroe Islands - FO
        /// </summary>
        [IBAN("FO", 18)]
        FaroeIslands,

        /// <summary>
        /// France - FR
        /// </summary>
        [IBAN("FR", 27)]
        France,

        /// <summary>
        /// Georgia - GE
        /// </summary>
        [IBAN("GE", 22)]
        Georgia,

        /// <summary>
        /// Germany - DE
        /// </summary>
        [IBAN("DE", 22)]
        Germany,

        /// <summary>
        /// Gibraltar - GI
        /// </summary>
        [IBAN("GI", 23)]
        Gibraltar,

        /// <summary>
        /// Greece - GR
        /// </summary>
        [IBAN("GR", 27)]
        Greece,

        /// <summary>
        /// Greenland - GL
        /// </summary>
        [IBAN("GL", 18)]
        Greenland,

        /// <summary>
        /// Hungary - HU
        /// </summary>
        [IBAN("HU", 28)]
        Hungary,

        /// <summary>
        /// Iceland - IS
        /// </summary>
        [IBAN("IS", 26)]
        Iceland,

        /// <summary>
        /// Ireland - IE
        /// </summary>
        [IBAN("IE", 22)]
        Ireland,

        /// <summary>
        /// Italy - IT
        /// </summary>
        [IBAN("IT", 27)]
        Italy,

        /// <summary>
        /// Latvia - LV
        /// </summary>
        [IBAN("LV", 21)]
        Latvia,

        /// <summary>
        /// Liechtenstein - LI
        /// </summary>
        [IBAN("LI", 21)]
        Liechtenstein,

        /// <summary>
        /// Lithuania - LT
        /// </summary>
        [IBAN("LT", 20)]
        Lithuania,

        /// <summary>
        /// Luxembourg - LU
        /// </summary>
        [IBAN("LU", 20)]
        Luxembourg,

        /// <summary>
        /// Macedonia - MK
        /// </summary>
        [IBAN("MK", 19)]
        Macedonia,

        /// <summary>
        /// Malta - MT
        /// </summary>
        [IBAN("MT", 31)]
        Malta,

        /// <summary>
        /// Moldova - MD
        /// </summary>
        [IBAN("MD", 24)]
        Moldova,

        /// <summary>
        /// Monaco - MC
        /// </summary>
        [IBAN("MC", 27)]
        Monaco,

        /// <summary>
        /// Montenegro - ME
        /// </summary>
        [IBAN("ME", 22)]
        Montenegro,

        /// <summary>
        /// Netherlands - NL
        /// </summary>
        [IBAN("NL", 18)]
        Netherlands,

        /// <summary>
        /// Norway - NO
        /// </summary>
        [IBAN("NO", 15)]
        Norway,

        /// <summary>
        /// Poland - PL
        /// </summary>
        [IBAN("PL", 28)]
        Poland,

        /// <summary>
        /// Portugal - PT
        /// </summary>
        [IBAN("PT", 25)]
        Portugal,

        /// <summary>
        /// Romania - RO
        /// </summary>
        [IBAN("RO", 24)]
        Romania,

        /// <summary>
        /// San Marino - SM
        /// </summary>
        [IBAN("SM", 27)]
        SanMarino,

        /// <summary>
        /// Serbia - RS
        /// </summary>
        [IBAN("RS", 22)]
        Serbia,

        /// <summary>
        /// Slovakia - SK
        /// </summary>
        [IBAN("SK", 24)]
        Slovakia,

        /// <summary>
        /// Slovenia - SI
        /// </summary>
        [IBAN("SI", 19)]
        Slovenia,

        /// <summary>
        /// Spain - ES
        /// </summary>
        [IBAN("ES", 24)]
        Spain,

        /// <summary>
        /// Switzerland - CH
        /// </summary>
        [IBAN("CH", 21)]
        Switzerland,

        /// <summary>
        /// Ukraine - UA
        /// </summary>
        [IBAN("UA", 29)]
        Ukraine,

        //List of non-European IBAN countries:

        /// <summary>
        /// Algeria - DZ
        /// </summary>
        [IBAN("DZ", 24)]
        Algeria,

        /// <summary>
        /// Angola - AO
        /// </summary>
        [IBAN("AO", 25)]
        Angola,

        /// <summary>
        /// Azerbaijan - AZ
        /// </summary>
        [IBAN("AZ", 28)]
        Azerbaijan,

        /// <summary>
        /// Bahrain - BH
        /// </summary>
        [IBAN("BH", 22)]
        Bahrain,

        /// <summary>
        /// Benin - BJ
        /// </summary>
        [IBAN("BJ", 28)]
        Benin,

        /// <summary>
        /// Brazil - BR
        /// </summary>
        [IBAN("BR", 29)]
        Brazil,

        /// <summary>
        /// British Virgin Islands - VG
        /// </summary>
        [IBAN("VG", 24)]
        BritishVirginIslands,

        /// <summary>
        /// Burkina Faso - BF
        /// </summary>
        [IBAN("BF", 27)]
        BurkinaFaso,

        /// <summary>
        /// Burundi - BI
        /// </summary>
        [IBAN("BI", 16)]
        Burundi,

        /// <summary>
        /// Cameroon - CM
        /// </summary>
        [IBAN("CM", 27)]
        Cameroon,

        /// <summary>
        /// Cape Verde - CV
        /// </summary>
        [IBAN("CV", 25)]
        CapeVerde,

        /// <summary>
        /// CG - CG
        /// </summary>
        [IBAN("CG", 27)]
        Congo,

        /// <summary>
        /// Costa Rica - CR
        /// </summary>
        [IBAN("CR", 21)]
        CostaRica,

        /// <summary>
        /// Dominican Republic - DO
        /// </summary>
        [IBAN("DO", 28)]
        DominicanRepublic,

        /// <summary>
        /// Egypt - EG
        /// </summary>
        [IBAN("EG", 27)]
        Egypt,

        /// <summary>
        /// Gabon - GA
        /// </summary>
        [IBAN("GA", 27)]
        Gabon,

        /// <summary>
        /// Guatemala - GT
        /// </summary>
        [IBAN("GT", 28)]
        Guatemala,

        /// <summary>
        /// Iran - IR
        /// </summary>
        [IBAN("IR", 26)]
        Iran,

        /// <summary>
        /// Israel - IL
        /// </summary>
        [IBAN("IL", 23)]
        Israel,

        /// <summary>
        /// Ivory Coast - CI
        /// </summary>
        [IBAN("CI", 28)]
        IvoryCoast,

        /// <summary>
        /// Jordan - JO
        /// </summary>
        [IBAN("JO", 30)]
        Jordan,

        /// <summary>
        /// Kazakhstan - KZ
        /// </summary>
        [IBAN("KZ", 20)]
        Kazakhstan,

        /// <summary>
        /// Kuwait - KW
        /// </summary>
        [IBAN("KW", 30)]
        Kuwait,

        /// <summary>
        /// Lebanon - LB
        /// </summary>
        [IBAN("LB", 28)]
        Lebanon,

        /// <summary>
        /// Madagascar - MG
        /// </summary>
        [IBAN("MG", 27)]
        Madagascar,

        /// <summary>
        /// Mali - ML
        /// </summary>
        [IBAN("ML", 28)]
        Mali,

        /// <summary>
        /// Mauritania - MR
        /// </summary>
        [IBAN("MR", 27)]
        Mauritania,

        /// <summary>
        /// Mauritius - MU
        /// </summary>
        [IBAN("MU", 30)]
        Mauritius,

        /// <summary>
        /// Mozambique - MZ
        /// </summary>
        [IBAN("MZ", 25)]
        Mozambique,

        /// <summary>
        /// Pakistan - PK
        /// </summary>
        [IBAN("PK", 24)]
        Pakistan,

        /// <summary>
        /// Palestine - PS
        /// </summary>
        [IBAN("PS", 29)]
        Palestine,

        /// <summary>
        /// QA
        /// </summary>
        [IBAN("QA", 29)]
        Qatar,

        /// <summary>
        /// Saudi Arabia - SA
        /// </summary>
        [IBAN("SA", 24)]
        SaudiArabia,

        /// <summary>
        /// Senegal - SN
        /// </summary>
        [IBAN("SN", 28)]
        Senegal,

        /// <summary>
        /// Tunisia - TN
        /// </summary>
        [IBAN("TN", 24)]
        Tunisia,

        /// <summary>
        /// Turkey - TR
        /// </summary>
        [IBAN("TR", 26)]
        Turkey,

        /// <summary>
        /// United Arab Emirates - AE
        /// </summary>
        [IBAN("AE", 23)]
        UnitedArabEmirates,
    }
}