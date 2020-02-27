import requests


class Util:
    sectors = []

    def __init__(self):
        et = "Electronic Technology"
        ds = "Distribution Services"
        ht = "Health Technology"
        cls = "Commercial Services"
        i = "Industrial Services"
        f = "Finance"
        pi = "Process Industries"
        t = "Transportation"
        ts = "Technology Services"
        pm = "Producer Manufacturing"
        rt = "Retail Trade"
        crs = "Consumer Services"
        nm = "Non-Energy Minerals"
        u = "Utilities"
        m = "Miscellaneous"
        hs = "Health Services"
        cd = "Consumer Durables"
        cn = "Consumer Non-Durables"
        c = "Communications"
        em = "Energy Minerals"
        g = "Government"
        self.sectors.append(et)
        self.sectors.append(ds)
        self.sectors.append(ht)
        self.sectors.append(cls)
        self.sectors.append(i)
        self.sectors.append(f)
        self.sectors.append(pi)
        self.sectors.append(t)
        self.sectors.append(ts)
        self.sectors.append(pm)
        self.sectors.append(rt)
        self.sectors.append(crs)
        self.sectors.append(nm)
        self.sectors.append(u)
        self.sectors.append(m)
        self.sectors.append(hs)
        self.sectors.append(cd)
        self.sectors.append(cn)
        self.sectors.append(c)
        self.sectors.append(em)
        self.sectors.append(g)

    def getSectors(self):
        return self.sectors


