<?xml version="1.0"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:kml="http://www.opengis.net/kml/2.2"
                exclude-result-prefixes="kml"
                version="1.0">

    <xsl:output indent="yes"/>

    <xsl:template match="*" mode="copy-no-namespaces">
        <xsl:element name="{local-name()}">
            <xsl:copy-of select="@*"/>
            <xsl:apply-templates select="node()" mode="copy-no-namespaces"/>
        </xsl:element>
    </xsl:template>

    <xsl:template match="comment()| processing-instruction()" mode="copy-no-namespaces">
        <xsl:copy/>
    </xsl:template>

    <xsl:template match="/kml:kml">
        <xsl:element name="Data">
            <xsl:apply-templates select="kml:Document/kml:Folder/kml:Placemark"
                                 mode="copy-no-namespaces"/>
        </xsl:element>
    </xsl:template>

</xsl:stylesheet>
