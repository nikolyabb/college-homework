<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <!-- <xsl:output method="html" indent="yes"/> -->
    <xsl:key name="kCity" match="item" use="@city"/>
    <xsl:key name="kOrg" match="item" use="concat(@city, '+', @org)"/>

    <xsl:template match="/orgs">
        <html>
            <h1>Города и компании</h1>
            <ul>
                <xsl:for-each select="item[generate-id() = generate-id(key('kCity', @city)[1])]">
                    <li>
                        <h3><xsl:value-of select="@city"/></h3>
                        <p>Всего товаров: <xsl:value-of select="count(key('kCity', @city))"/></p>

                        <xsl:for-each select="key('kCity', @city)[generate-id() = generate-id(key('kOrg', concat(@city, '+', @org))[1])]">
                            <ul>
                                <li>
                                    <h4><xsl:value-of select="@org"/></h4>
                                    <p>Всего товаров: <xsl:value-of select="count(key('kOrg', concat(@city, '+', @org)))"/></p>

                                    <ul>
                                        <xsl:for-each select="key('kOrg', concat(@city, '+', @org))">
                                            <li>
                                                <xsl:value-of select="@title"/>
                                            </li>
                                        </xsl:for-each>
                                    </ul>
                                </li>
                            </ul> 
                        </xsl:for-each>
                    </li>
                </xsl:for-each>
            </ul>
        </html>
    </xsl:template>
</xsl:stylesheet>